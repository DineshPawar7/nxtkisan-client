import { useState } from "react";
import "./CreatePost.css";

const CreatePost = ({ postType, onClose, onPostSubmit }) => {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [articleText, setArticleText] = useState("");
  const [loading, setLoading] = useState(false);
  const username = "Guest User";

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setLoading(true);

    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        username,
        caption,
        type: postType,
        article: postType === "article" ? articleText : null,
        tags: tags.split(",").map((tag) => tag.trim()),
      };

      console.log("Mock Post Created:", newPost);
      alert("Post created (Frontend only, no backend)");

      onPostSubmit && onPostSubmit(newPost);
      setCaption("");
      setTags("");
      setArticleText("");
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create {postType}</h3>
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        {postType === "photo" || postType === "video" ? (
          <p className="coming-soon">📢 Coming Soon: This feature is under development.</p>
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
