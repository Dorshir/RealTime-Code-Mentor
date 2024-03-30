import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import CodeEditor from "./CodeEditor";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Smiley from "./Smiley";

const socket = io(import.meta.env.VITE_REACT_APP_BASE_URL, {
  transports: ["websocket", "polling"],
});

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

    if (codeBlock?.solution) {
      setProcessedSolution(preprocessCode(codeBlock.solution));
    }

    return () => {
      socket.off("role_assigned");
      socket.off("code_update");
    };
  }, [id, codeBlock?.solution]);

  useEffect(() => {
    if (showSmiley) {
      const timeout = setTimeout(() => {
        setShowSmiley(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [showSmiley]);

  const handleCodeChange = (newCode) => {
    setEditorValue(newCode);
    socket.emit("code_update", { codeBlockId: id, newCode });
    // Preprocess the new code
    const processedNewCode = preprocessCode(newCode);

    // Check if the processed new code matches the preprocessed solution
    if (processedNewCode === processedSolution) {
      setShowSmiley(true);
    } else {
      setShowSmiley(false);
    }
  };

  // Function to preprocess the code string by removing spaces and semicolons
  const preprocessCode = (code) => {
    return code.replace(/[ ;\n]+/g, "");
  };

  const renderExamples = () => {
    return (
      <div className="code-description">
        {codeBlock?.["i/o examples"]?.map((example, index) => (
          <React.Fragment key={index}>
            {index % 2 === 0 && <p>Example {Math.floor(index / 2) + 1}:</p>}{" "}
            {/* Increment example index */}
            <p
              style={{
                fontWeight: "bold",
                marginLeft: "30px",
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              {example}
            </p>
            {(index + 1) % 2 === 0 &&
              index !== codeBlock["i/o examples"].length - 1 && (
                <hr style={{ marginTop: "20px" }} />
              )}{" "}
            {/* Add <hr /> after all items except the last one */}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="code-container">
      {showSmiley && <Smiley />}{" "}
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
        {renderExamples()}
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
