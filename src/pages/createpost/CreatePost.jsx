import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./CreatePost.css";

const CreatePost = ({ postType, onClose, onPostSubmit }) => {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [articleText, setArticleText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          console.log("🔍 Fetching user data...");
          const token = localStorage.getItem("token");

          const res = await fetch(`/api/users/${user._id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (res.ok) {
            setUsername(data.username);
          } else {
            console.error("❌ Error fetching user data:", data.message);
            setUsername("Unknown User");
          }
        } catch (error) {
          console.error("❌ Error fetching username:", error);
          setUsername("Unknown User");
        }
      }
    };

    fetchUsername();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("You must be logged in to post!");
      return;
    }

    setLoading(true);

    try {
      const newPost = {
        userId: user._id,
        username: username || "Unknown User",
        userImage: user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        caption,
        tags: tags.split(",").map((tag) => tag.trim()),
        type: postType,
        article: postType === "article" ? articleText : "",
      };

      const token = localStorage.getItem("token");

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error uploading post");
      }

      console.log("✅ Post saved:", data);
      onPostSubmit && onPostSubmit(data);
      setCaption("");
      setTags("");
      setArticleText("");
      onClose();
    } catch (error) {
      console.error("❌ Error uploading post:", error);
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create {postType}</h3>
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        {postType === "photo" || postType === "video" ? (
          <p className="coming-soon">
            📢 Coming Soon: This feature is under development.
          </p>
        ) : (
          <>
            {postType === "article" && (
              <textarea
                placeholder="Write your article..."
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
              ></textarea>
            )}

            <input
              type="text"
              placeholder="Caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <input
              type="text"
              placeholder="Tags (comma separated)..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
