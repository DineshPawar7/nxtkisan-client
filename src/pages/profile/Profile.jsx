import { useEffect, useState } from "react";
import { fetchUserPosts } from "../../api/Api";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      console.log("Profile Page: Fetching user posts for userId:", user.uid);
      const getUserPosts = async () => {
        try {
          const userPosts = await fetchUserPosts(String(user.uid));
          console.log("Profile Page: User Posts:", userPosts);
          setPosts(userPosts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      };
      getUserPosts();
    }
  }, [user]);
  

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={user?.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu4xlF9ySpaUQxoGlcBxTbU3SGyb077xI1UQ&s"}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <h2 className="username">{user?.displayName || "User"}</h2>
          <p className="full-name">{user?.email}</p>
          <p className="bio">Welcome to my profile!</p>
        </div>
      </div>

      <hr className="divider" />

      {/* User's Posts */}
      {posts.length > 0 ? (
        <div className="post-grid">
          {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h4>{post.username}</h4>
          <p>{post.caption}</p>
          {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
        </div>
      ))}
        </div>
      ) : (
        <p className="no-posts">No posts yet.</p>
      )}
    </div>
  );
};

export default Profile;
