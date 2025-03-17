import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="feed-container">
      <h2>Feed</h2>
      {posts.length === 0 ? <p>No posts yet.</p> : null}

      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h4>{post.username}</h4>
          <p>{post.caption}</p>
          {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
        </div>
      ))}
    </div>
  );
};

export default Feed;
