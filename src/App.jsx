import React, { useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Advertisement from "./components/ads/Advertisement";
import CreatePost from "./pages/createpost/CreatePost";
import MandiBhav from "./pages/mandibhav/Mandibhav";
import Chatbot from "./pages/ai/Chatbot";
import Feed from "./pages/feed/Feed";
import Signup from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const App = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCreate = async (type) => {
    let formData = new FormData();

    if (type === "article") {
      const articleText = prompt("Enter your article:");
      if (!articleText) return;

      await axios.post("http://localhost:5000/api/posts/article", {
        userId: "123",
        username: "John Doe",
        article: articleText,
        caption: "New article posted!",
      });

      fetchPosts();
    } else {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = type === "photo" ? "image/*" : "video/*";
      fileInput.click();

      fileInput.onchange = async () => {
        if (!fileInput.files[0]) return;

        formData.append("file", fileInput.files[0]);
        formData.append("userId", "123");
        formData.append("username", "John Doe");
        formData.append("type", type);
        formData.append("caption", `New ${type} posted!`);

        await axios.post("http://localhost:5000/api/posts/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fetchPosts();
      };
    }
  };

  return (
    <div >
      <Sidebar onCreate={handleCreate} />
      

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/mandibhav" element={<MandiBhav />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/feed" element={<Feed posts={posts} />} />
        </Routes>


      <Advertisement />
    </div>
  );
};

export default App;
