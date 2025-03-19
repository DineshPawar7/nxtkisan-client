import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.displayName || "User"); // Default to "User"

  useEffect(() => {
    const getUsername = async (userId) => {
      if (!userId) return;

      try {
        console.log("🔍 Fetching username for userId:", userId);
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          console.log("Username found:", userDoc.data().username);
          setUsername(userDoc.data().username);
        } else {
          console.warn("User not found in Firestore.");
        }
      } catch (error) {
        console.error("Firestore error:", error.message);
      }
    };

    if (user?.uid) {
      console.log("👤 Profile Page: Fetching data for userId:", user.uid);
      getUsername(user.uid);
    }
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <h2 className="username">{username}</h2>
          <p className="full-name">{user?.email}</p>
          <p className="bio">Welcome to my profile!</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
