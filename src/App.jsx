import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { db } from "./firebase"; // ✅ Firestore import kiya
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Sidebar from "./components/sidebar/Sidebar";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Advertisement from "./components/ads/Advertisement";
import CreatePost from "./pages/createpost/CreatePost";
import MandiBhav from "./pages/mandibhav/Mandibhav";
import Chatbot from "./pages/ai/Chatbot";
import Feed from "./pages/feed/Feed";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

function App() {
  const [postType, setPostType] = useState(null);
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = (type) => {
    setPostType(type);
  };

  const handleClose = () => {
    setPostType(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onCreate={handleCreate} />

      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/mandibhav" element={<MandiBhav />} />
        </Routes>

        {location.pathname === "/" && <Feed posts={posts} />}
      </div>

      {postType && <CreatePost postType={postType} onClose={handleClose} />}

      <Advertisement />
    </div>
  );
}

export default App;
