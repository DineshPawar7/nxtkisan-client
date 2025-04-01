import { useEffect, useState } from "react";
import axios from "axios";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      fetchUsernames(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUsernames = async (postsData) => {
    const usernameMap = { ...usernames };
    const fetchPromises = postsData.map(async (post) => {
      if (!usernameMap[post.userId]) {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${post.userId}`);
          usernameMap[post.userId] = res.data.username || "Unknown User";
        } catch (error) {
          console.error("Error fetching username:", error);
          usernameMap[post.userId] = "Unknown User";
        }
      }
    });

    await Promise.all(fetchPromises);
    setUsernames(usernameMap);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed-container">
      {posts.length === 0 ? <p>No posts yet.</p> : null}

      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <img
              src={post.userImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="user-img"
            />

            <div>
              <h4 className="username">
                {usernames[post.userId] || "Unknown User"}
              </h4>
            </div>
          </div>

          {post.type === "article" && post.article && (
            <div className="post-article">
              <p>{post.article}</p>
            </div>
          )}

          {(post.type === "photo" || post.type === "video") && post.mediaUrl && (
            <div className="post-media">
              {post.type === "photo" ? (
                <img src={post.mediaUrl} alt="Post" className="post-image" />
              ) : (
                <video controls className="post-video">
                  <source src={post.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <p className="caption">{post.caption}</p>

          <div className="post-actions">
            <button>❤️</button>
            <button>💬</button>
            <button>📤</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
