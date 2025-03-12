import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaComment, FaShare } from "react-icons/fa";
import "./Feed.css";

const Feed = ({ newPost }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "Rahul Farmer",
      userImage: "https://example.com/user1.jpg",
      postImage: "https://example.com/post1.jpg",
      caption: "आज बहुत अच्छी फसल हुई! 🌾🚜",
      likes: 34,
    }
  ]);

  useEffect(() => {
    if (newPost) {
      setPosts((prevPosts) => {
        if (prevPosts.some((post) => post.id === newPost.id)) {
          return prevPosts;
        }
        return [newPost, ...prevPosts];
      });
    }
  }, [newPost]);
  

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <img src={post.userImage} alt={post.username} className="user-img" />
            <h4>{post.username}</h4>
          </div>
          {post.type === "article" ? (
            <p>{post.article}</p>
          ) : (
            <img src={post.postImage} alt="Post" className="post-img" />
          )}
          <div className="post-actions">
            <button><FaHeart /></button>
            <button><FaComment /></button>
            <button><FaShare /></button>
          </div>
          <p className="likes">{post.likes} likes</p>
          <p className="caption"><strong>{post.username}</strong> {post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
