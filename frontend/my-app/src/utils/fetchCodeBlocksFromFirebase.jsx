import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const fetchCodeBlocksFromFirebase = async () => {
  try {
    const codeBlocksCollection = collection(db, "codeBlocks");
    const codeBlocksSnapshot = await getDocs(codeBlocksCollection);
    const codeBlocks = codeBlocksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return codeBlocks;
  } catch (error) {
    console.error("Error fetching code blocks:", error);
    return []; // Return an empty array in case of error
  }
};

export default fetchCodeBlocksFromFirebase;
