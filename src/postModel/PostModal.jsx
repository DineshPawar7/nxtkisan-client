import React, { useState } from "react";
import "./PostModal.css";

const PostModal = ({ postType, user, onClose, onSubmit }) => {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setMediaUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!content && !mediaUrl) {
      alert("Post content cannot be empty!");
      return;
    }

    const newPost = {
      _id: Date.now().toString(),
      userId: user._id,
      username: user.name,
      userImage: user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      type: postType,
      article: postType === "article" ? content : "",
      mediaUrl: postType === "photo" || postType === "video" ? mediaUrl : "",
      caption: postType !== "article" ? content : "",
    };

    onSubmit(newPost);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create {postType.charAt(0).toUpperCase() + postType.slice(1)} Post</h2>

        {postType === "article" && (
          <textarea
            placeholder="Write your article..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}

        {(postType === "photo" || postType === "video") && (
          <>
            <input
              type="file"
              accept={postType === "photo" ? "image/*" : "video/*"}
              onChange={handleFileUpload}
            />
            {mediaUrl && (postType === "photo" ? (
              <img src={mediaUrl} alt="Preview" className="preview-img" />
            ) : (
              <video src={mediaUrl} controls className="preview-video" />
            ))}
          </>
        )}

        <button onClick={handlePost}>Post</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PostModal;
