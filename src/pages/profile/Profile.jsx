import { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [username, setUsername] = useState(storedUser.name || "Guest User");
  const [email, setEmail] = useState(storedUser.email || "guest@example.com");
  const [profilePic, setProfilePic] = useState(
    storedUser.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUsername(updatedUser.name || "Guest User");
    setEmail(updatedUser.email || "guest@example.com");
    setProfilePic(updatedUser.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
  }, []);

  // Profile Upload Function
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...storedUser, profilePic: reader.result };

      // Save in LocalStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update State
      setProfilePic(reader.result);

      // Dispatch Event for Feed Update
      window.dispatchEvent(new Event("profilePicUpdated"));

      setUploading(false);
    };
    reader.readAsDataURL(file);
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
          <p className="full-name">{email}</p>
          <p className="bio">Welcome to my profile!</p>
          {uploading && <p>Uploading...</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
