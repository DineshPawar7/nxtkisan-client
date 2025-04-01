import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "User");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "https://via.placeholder.com/150");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/${user._id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setUsername(data.username);
          setProfilePic(data.profilePic || "https://via.placeholder.com/150");
        } else {
          console.error("❌ Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error.message);
      }
    };

    fetchUserProfile();
  }, [user]);

  // 🖼️ Upload Profile Picture
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`/api/users/${user._id}/upload-profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload profile picture");
      }

      setProfilePic(data.profilePic);
      console.log("✅ Profile picture updated successfully!");
    } catch (error) {
      console.error("🔥 Error uploading profile picture:", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <label htmlFor="profile-upload">
          <img src={profilePic} alt="Profile" className="profile-pic" />
        </label>
        <input 
          type="file" 
          id="profile-upload" 
          style={{ display: "none" }} 
          onChange={handleProfileUpload} 
          accept="image/*"
        />
        <div className="profile-info">
          <h2 className="username">{username}</h2>
          <p className="full-name">{user?.email}</p>
          <p className="bio">Welcome to my profile!</p>
          {uploading && <p>Uploading...</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
