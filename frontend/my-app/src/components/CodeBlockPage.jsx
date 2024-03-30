import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import CodeEditor from "./CodeEditor";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const socket = io(import.meta.env.VITE_REACT_APP_BASE_URL);

const CodeBlockPage = () => {
  const { id } = useParams();
  const [codeBlock, setCodeBlock] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const fetchCodeBlock = async () => {
      try {
        const codeBlockDocRef = doc(db, "codeBlocks", id);
        const codeBlockDocSnap = await getDoc(codeBlockDocRef);
        if (codeBlockDocSnap.exists()) {
          const data = codeBlockDocSnap.data();
          // Assuming the structure of the document matches your expectations
          setCodeBlock(data);
          setEditorValue(data.code);
        } else {
          console.log("Code block not found");
        }
      } catch (error) {
        console.error("Error fetching code block:", error);
      }
    };

    fetchCodeBlock();

    socket.emit("join_code_block", id);

    socket.on("role_assigned", (role) => {
      setIsMentor(role === "mentor");
    });

    socket.on("code_update", (newCode) => {
      setEditorValue(newCode);
    });

    return () => {
      socket.off("role_assigned");
      socket.off("code_update");
    };
  }, [id]);

  const handleCodeChange = (newCode) => {
    setEditorValue(newCode);
    socket.emit("code_update", { codeBlockId: id, newCode });
  };

  return (
    <div className="code-container">
      <div className="code-details">
        <h1 className="code-title">{codeBlock?.title}</h1>
        <p className="user-role">
          <span
            style={{
              backgroundColor: isMentor ? "blue" : "green",
            }}
          ></span>
          {isMentor ? "Mentor" : "Student"}
        </p>
        <div className="code-description">{codeBlock?.details}</div>
      </div>
      <div style={{ marginLeft: "40px", width: "650px" }}>
        <CodeEditor
          value={editorValue}
          onChange={handleCodeChange}
          readOnly={isMentor}
        />
      </div>
    </div>
  );
};

export default CodeBlockPage;
