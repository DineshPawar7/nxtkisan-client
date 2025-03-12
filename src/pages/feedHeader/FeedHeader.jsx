import React, { useState } from "react";
import "./feedHeader.css";

const Feedheader = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="feedHeader">
      <div className="nav-tabs">
        <button
          className={activeTab === "trending" ? "active" : ""}
          onClick={() => setActiveTab("trending")}
        >
          🔥 Trending
        </button>
        <button
          className={activeTab === "news" ? "active" : ""}
          onClick={() => setActiveTab("news")}
        >
          📰 Kisan News
        </button>
        <button
          className={activeTab === "debate" ? "active" : ""}
          onClick={() => setActiveTab("debate")}
        >
          🗣️ Debate
        </button>
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          📝 Posts
        </button>
      </div>
    </div>
  );
};

export default Feedheader;
