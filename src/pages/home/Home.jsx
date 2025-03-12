import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Ads from "../../components/ads/Ads";
import Feed from "../../pages/feed/Feed";
import CreatePost from "../../pages/createpost/CreatePost";
import Feedheader from "../feedHeader/FeedHeader";

const Home = () => {
  const [postType, setPostType] = useState(null);
  const [newPost, setNewPost] = useState(null);

  return (
    <div>
      <Sidebar onCreate={(type) => setPostType(type)} />
      <Ads />
      <div
        style={{ marginLeft: "260px", marginRight: "320px", padding: "20px" }}
      >
        <Feedheader />
        {postType && (
          <CreatePost
            postType={postType}
            onClose={() => setPostType(null)}
            onPostSubmit={setNewPost}
          />
        )}
        <Feed newPost={newPost} />
      </div>
    </div>
  );
};

export default Home;
