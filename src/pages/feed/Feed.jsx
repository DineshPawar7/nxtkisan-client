import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData);
      fetchUsernames(postsData);
    });

    return () => unsubscribe();
  }, []);

  const fetchUsernames = async (postsData) => {
    const usernameMap = { ...usernames };

    const fetchPromises = postsData.map(async (post) => {
      if (!usernameMap[post.userId]) {
        try {
          const userDoc = await getDoc(doc(db, "users", post.userId));
          if (userDoc.exists()) {
            usernameMap[post.userId] = userDoc.data().username;
          } else {
            usernameMap[post.userId] = "Unknown User";
          }
        } catch (error) {
          console.error("❌ Error fetching username:", error);
          usernameMap[post.userId] = "Unknown User";
        }
      }
    });

    await Promise.all(fetchPromises);
    setUsernames(usernameMap);
  };

  return (
    <div className="feed-container">
      {posts.length === 0 ? <p>No posts yet.</p> : null}

      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <img
              src={
                post.userImage
                  ? post.userImage
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="user-img"
            />

            <div>
              <h4 className="username">
                {usernames[post.userId]
                  ? usernames[post.userId]
                  : "Unknown User"}
              </h4>
            </div>
          </div>

          {post.type === "article" && post.article && (
            <div className="post-article">
              <p>{post.article}</p>
            </div>
          )}

          <p className="caption">{post.caption}</p>

          <div className="post-actions">
            <button>❤️</button>
            <button>💬</button>
            <button>📤</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
