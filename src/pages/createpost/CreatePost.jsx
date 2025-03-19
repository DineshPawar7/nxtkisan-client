import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import "./CreatePost.css";

const CreatePost = ({ postType, onClose, onPostSubmit }) => {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [articleText, setArticleText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (user && user.uid) {
        try {
          console.log("🔍 Fetching username for userId:", user.uid);
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            console.log("✅ Firestore User Data:", userDoc.data());
            setUsername(userDoc.data().username);
          } else {
            console.error(
              "❌ No username found in Firestore for userId:",
              user.uid
            );
            setUsername("Unknown User");
          }
        } catch (error) {
          console.error("❌ Error fetching username:", error);
          setUsername("Unknown User");
        }
      }
    };

    fetchUsername();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !user.uid) {
      alert("You must be logged in to post!");
      return;
    }

    setLoading(true);

    try {
      const newPost = {
        userId: String(user.uid),
        username: username || "Unknown User",
        userImage:
          user.photoURL ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        caption,
        tags: tags.split(",").map((tag) => tag.trim()),
        type: postType,
        article: postType === "article" ? articleText : "",
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "posts"), newPost);
      console.log("✅ Post saved with ID:", docRef.id);

      onPostSubmit && onPostSubmit(newPost);
      setCaption("");
      setTags("");
      setArticleText("");
      onClose();
    } catch (error) {
      console.error("❌ Error uploading post:", error);
      alert("Error uploading post");
    }

    setLoading(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create {postType}</h3>
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        {postType === "photo" || postType === "video" ? (
          <p className="coming-soon">
            📢 Coming Soon: This feature is under development.
          </p>
        ) : (
          <>
            {postType === "article" && (
              <textarea
                placeholder="Write your article..."
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
              ></textarea>
            )}

            <input
              type="text"
              placeholder="Caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <input
              type="text"
              placeholder="Tags (comma separated)..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
