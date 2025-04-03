import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Advertisement from "./components/ads/Advertisement";
import MandiBhav from "./pages/mandibhav/Mandibhav";
import Chatbot from "./pages/ai/Chatbot";
import Feed from "./pages/feed/Feed";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PostModal from "./postModel/PostModal.jsx";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://nxtkisan-server.onrender.com/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      
      const data = await res.json();
      console.log("Fetched Posts:", data);
  
      setPosts(data);
    } catch (error) {
      console.error("Error Fetching Posts:", error);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  

  const handleCreate = (type) => {
    if (!user) {
      alert("You need to be logged in to create a post.");
      return;
    }
    setSelectedPostType(type);
    setShowPostModal(true);
  };

  
  const handlePostSubmit = async (newPost) => {
    try {
      const formData = new FormData();
      formData.append("userId", newPost.userId);
      formData.append("username", newPost.username);
      formData.append("userImage", newPost.userImage);
      formData.append("type", newPost.type);
      formData.append("article", newPost.article);
      formData.append("caption", newPost.caption);
      
      if (newPost.file) {
        formData.append("media", newPost.file);
      }
  
      const res = await fetch("https://nxtkisan-server.onrender.com/api/posts", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      if (data.success) {
        setPosts((prevPosts) => [data.post, ...prevPosts]);
      }
  
      setShowPostModal(false);
    } catch (error) {
      console.error(" Error Creating Post:", error);
    }
  };
  

  return (
    <div>
      <Sidebar onCreate={handleCreate} />

      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/chatbot" element={<Chatbot />} />
  <Route path="/mandibhav" element={<MandiBhav />} />
  <Route path="/feed" element={<Feed posts={posts} />} />
</Routes>

      {showPostModal && (
        <PostModal
          postType={selectedPostType}
          user={user}
          onClose={() => setShowPostModal(false)}
          onSubmit={handlePostSubmit}
        />
      )}

      <Advertisement />
    </div>
  );
};

export default App;
