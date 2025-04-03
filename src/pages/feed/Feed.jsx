import { useState, useEffect } from "react";
import "./Feed.css";

const Feed = ({ selectedPostType, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setProfilePic(storedUser.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png");

    const handleProfileUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
      setProfilePic(updatedUser.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
    };

    window.addEventListener("profilePicUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profilePicUpdated", handleProfileUpdate);
    };
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const username = storedUser.name || "Guest User";
  const userId = storedUser._id || "guest";

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://nxtkisan-server.onrender.com/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(" Error Fetching Posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPostContent && !mediaUrl) {
      alert("Content cannot be empty!");
      return;
    }

    const newPost = {
      userId,
      username,
      userImage: profilePic,
      type: selectedPostType,
      article: selectedPostType === "article" ? newPostContent : "",
      mediaUrl: selectedPostType === "photo" || selectedPostType === "video" ? mediaUrl : "",
      caption: selectedPostType === "photo" || selectedPostType === "video" ? newPostContent : "",
    };

    try {
      const res = await fetch("https://nxtkisan-server.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts((prevPosts) => [data, ...prevPosts]);
      }

      setShowModal(false);
      setNewPostContent("");
      setMediaUrl("");
      onClose();
    } catch (error) {
      console.error("Error Creating Post:", error);
    }
  };

  return (
    <div className="feed-container">
      {showModal && (
        <div className="modal">
          <h2>Create {selectedPostType.charAt(0).toUpperCase() + selectedPostType.slice(1)} Post</h2>

          {selectedPostType === "article" && (
            <textarea
              placeholder="Write your article..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          )}

          {(selectedPostType === "photo" || selectedPostType === "video") && (
            <>
              <input
                type="file"
                accept={selectedPostType === "photo" ? "image/*" : "video/*"}
                onChange={handleFileUpload}
              />
              {mediaUrl && (selectedPostType === "photo" ? (
                <img src={mediaUrl} alt="Preview" className="preview-img" />
              ) : (
                <video src={mediaUrl} controls className="preview-video" />
              ))}
            </>
          )}

          <button onClick={handlePost}>Post</button>
          <button onClick={() => { setShowModal(false); onClose(); }}>Cancel</button>
        </div>
      )}

      {posts.length === 0 ? <p>No posts yet.</p> : null}

      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <img src={post.userImage} alt="Profile" className="user-img" />
            <div>
              <h4 className="username">{post.username}</h4>
            </div>
          </div>

          {post.type === "article" && <div className="post-article"><p>{post.article}</p></div>}

          {(post.type === "photo" || post.type === "video") && post.mediaUrl && (
            <div className="post-media">
              {post.type === "photo" ? <img src={post.mediaUrl} alt="Post" className="post-image" /> : (
                <video controls className="post-video"><source src={post.mediaUrl} type="video/mp4" /></video>
              )}
            </div>
          )}

          <p className="caption">{post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;