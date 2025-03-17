import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./CreatePost.css";

const CreatePost = ({ postType, onClose, onPostSubmit }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [articleText, setArticleText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !user.uid) {
      alert("You must be logged in to post!");
      return;
    }

    setLoading(true);
    let fileUrl = "";

    try {
      const storage = getStorage();

      if (file) {
        const storageRef = ref(storage, `posts/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }

      const newPost = {
        userId: String(user.uid),
        username: user.displayName || user.email,
        userImage: user.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu4xlF9ySpaUQxoGlcBxTbU3SGyb077xI1UQ&s",
        caption,
        tags: tags.split(",").map((tag) => tag.trim()),
        type: postType,
        imageUrl: fileUrl,
        article: postType === "article" ? articleText : "",
        timestamp: serverTimestamp(),
      };
      

      const docRef = await addDoc(collection(db, "posts"), newPost);
      console.log("Post saved with ID:", docRef.id);

      onPostSubmit && onPostSubmit(newPost);
      setCaption("");
      setTags("");
      setFile(null);
      setArticleText("");
      onClose();
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Error uploading post");
    }

    setLoading(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create {postType}</h3>
        <button className="close-btn" onClick={onClose}>X</button>

        {postType !== "article" && (
          <input
            type="file"
            accept={postType === "photo" ? "image/*" : "video/*"}
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

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
      </div>
    </div>
  );
};

export default CreatePost;
