import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import CodeBlockDetails from "../components/CodeBlockDetails";
import CodeBlockEditor from "../components/CodeBlockEditor";
import Smiley from "../components/Smiley";

// Initialize socket connection
const socket = io(import.meta.env.VITE_REACT_APP_BASE_URL);

const CodeBlockPage = () => {
  // Retrieve code block ID from URL params
  const { id } = useParams();
  
  // State variables to manage code block data
  const [codeBlock, setCodeBlock] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [showSmiley, setShowSmiley] = useState(false);
  const [processedSolution, setProcessedSolution] = useState("");

  // Effect to fetch code block data from Firebase
  useEffect(() => {
    const fetchCodeBlock = async () => {
      try {
        const codeBlockDocRef = doc(db, "codeBlocks", id);
        const codeBlockDocSnap = await getDoc(codeBlockDocRef);
        if (codeBlockDocSnap.exists()) {
          const data = codeBlockDocSnap.data();
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

    // Join socket room for the code block
    socket.emit("join_code_block", id);

    // Listen for role assignment from socket
    socket.on("role_assigned", (role) => {
      setIsMentor(role === "mentor");
    });

    // Listen for code updates from socket
    socket.on("code_update", (newCode) => {
      setEditorValue(newCode);
    });

    // Cleanup function to remove event listeners
    return () => {
      socket.off("role_assigned");
      socket.off("code_update");
    };
  }, [id]);

  // Effect to preprocess solution code when code block changes
  useEffect(() => {
    if (codeBlock?.solution) {
      setProcessedSolution(preprocessCode(codeBlock.solution));
    }
  }, [codeBlock?.solution]);

  // Effect to manage smiley display with timeout
  useEffect(() => {
    if (showSmiley) {
      return showSmileyWithTimeout();
    }
  }, [showSmiley]);

  // Function to display smiley for 5 seconds
  const showSmileyWithTimeout = () => {
    setShowSmiley(true);
    const timeout = setTimeout(() => {
      setShowSmiley(false);
    }, 5000);
    return () => clearTimeout(timeout);
  };

  // Function to handle code change
  const handleCodeChange = (newCode) => {
    setEditorValue(newCode);
    socket.emit("code_update", { codeBlockId: id, newCode });
    const processedNewCode = preprocessCode(newCode);
    if (processedNewCode === processedSolution) {
      setShowSmiley(true);
    } else {
      setShowSmiley(false);
    }
  };

  // Function to preprocess code by removing unnecessary characters
  const preprocessCode = (code) => {
    return code.replace(/[ ;\n]+/g, "");
  };

  // Render the code block page UI
  return (
    <div className="code-container">
      {showSmiley && <Smiley />} {/* Render smiley if showSmiley is true */}
      <CodeBlockDetails codeBlock={codeBlock} isMentor={isMentor} />
      <CodeBlockEditor
        value={editorValue}
        onChange={handleCodeChange}
        readOnly={isMentor}
      />
    </div>
  );
};

export default CodeBlockPage;
