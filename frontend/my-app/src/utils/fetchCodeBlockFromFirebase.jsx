import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

const fetchCodeBlockFromFirebase = async ({id}) => {
  try {
    const codeBlockDocRef = doc(db, "codeBlocks", id);
    const codeBlockDocSnap = await getDoc(codeBlockDocRef);
    if (codeBlockDocSnap.exists()) {
      const data = codeBlockDocSnap.data();
      // Assuming the structure of the document matches your expectations
      return data;
    } else {
      console.log("Code block not found");
    }
  } catch (error) {
    console.error("Error fetching code block:", error);
  }
};

export default fetchCodeBlockFromFirebase;
