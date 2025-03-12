import React, { useState } from "react";
import "./CreatePost.css";

const CreatePost = ({ postType, onClose, onPostSubmit }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [articleText, setArticleText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newPost = {
      id: Date.now(),
      username: "User",
      userImage: "https://example.com/user.jpg",
      postImage: postType !== "article" ? URL.createObjectURL(file) : "",
      caption,
      tags,
      type: postType,
      article: postType === "article" ? articleText : "",
    };
  
    onPostSubmit(newPost);
    onClose();
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create {postType}</h3>
        <button className="close-btn" onClick={onClose}>X</button>

        {postType !== "article" && (
          <input type="file" accept={postType === "photo" ? "image/*" : "video/*"} onChange={(e) => setFile(e.target.files[0])} />
        )}

        {postType === "article" && (
          <textarea placeholder="Write your article..." value={articleText} onChange={(e) => setArticleText(e.target.value)}></textarea>
        )}

        <input type="text" placeholder="Caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <input type="text" placeholder="Tags (comma separated)..." value={tags} onChange={(e) => setTags(e.target.value)} />
        
        <button onClick={handleSubmit}>Post</button>
      </div>
    </div>
  );
};

export default CreatePost;
