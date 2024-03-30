import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import CodeBlockDetails from "../components/CodeBlockDetails";
import CodeBlockEditor from "../components/CodeBlockEditor";
import Smiley from "../components/Smiley";

const socket = io(import.meta.env.VITE_REACT_APP_BASE_URL);

const CodeBlockPage = () => {
  const { id } = useParams();
  const [codeBlock, setCodeBlock] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [showSmiley, setShowSmiley] = useState(false);
  const [processedSolution, setProcessedSolution] = useState("");

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

  useEffect(() => {
    if (codeBlock?.solution) {
      setProcessedSolution(preprocessCode(codeBlock.solution));
    }
  }, [codeBlock?.solution]);

  useEffect(() => {
    if (showSmiley) {
      return showSmileyWithTimeout();
    }
  }, [showSmiley]);

  const showSmileyWithTimeout = () => {
    setShowSmiley(true);
    const timeout = setTimeout(() => {
      setShowSmiley(false);
    }, 5000);
    return () => clearTimeout(timeout);
  };

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

  const preprocessCode = (code) => {
    return code.replace(/[ ;\n]+/g, "");
  };

  return (
    <div className="code-container">
      {showSmiley && <Smiley />}
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
