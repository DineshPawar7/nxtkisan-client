import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase"; 

export const fetchUserPosts = async (userId) => {
  if (!userId) {
    console.error("fetchUserPosts Error: userId is missing!");
    return [];
  }

  try {
    console.log(`Fetching posts for userId: ${userId}`);

    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const userPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("User Posts Fetched:", userPosts);
    return userPosts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};
