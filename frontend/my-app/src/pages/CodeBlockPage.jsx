import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import CodeBlockDetails from "../components/CodeBlockDetails";
import CodeBlockEditor from "../components/CodeBlockEditor";
import Smiley from "../components/Smiley";
import IconBreadCrumbs from "../components/IconBreadCrumbs";
import Notification from "../components/Notification";
import { Snackbar, Alert } from "@mui/material";

const CodeBlockPage = () => {
  const { id } = useParams();
  const [codeBlock, setCodeBlock] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [roleAssigned, setRoleAssigned] = useState(false);
  const [showSmiley, setShowSmiley] = useState(false);
  const [processedSolution, setProcessedSolution] = useState("");
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Create and set the socket connection upon component mount
    const newSocket = io(import.meta.env.VITE_REACT_APP_BASE_URL);
    setSocket(newSocket);

    return () => {
      // Disconnect socket when component unmounts
      newSocket.disconnect();
    };
  }, []);

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
  }, [id, db]);

  useEffect(() => {
    if (socket) {
      socket.emit("join_code_block", id);

      socket.on("role_assigned", (role) => {
        setIsMentor(role === "mentor");
        setRoleAssigned(true);
      });

      socket.on("code_update", (newCode) => {
        setEditorValue(newCode);
      });

      socket.on("mentor_left", () => {
        setNotification("The mentor has left the session.");
        setIsMentor(false);
      });

      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "";
        socket.emit("leaving_page", id);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup function to remove event listeners
      return () => {
        socket.off("mentor_left");
        socket.off("role_assigned");
        socket.off("code_update");
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [socket, id]);

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

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification(null);
  };

  // Render the code block page UI
  return (
    <div>
      <div style={{ display: "flex", position: "relative" }}>
        {roleAssigned && (
          <p className="user-role">
            <span
              style={{ backgroundColor: isMentor ? "blue" : "green" }}
            ></span>
            {isMentor ? "Mentor" : "Student"}
          </p>
        )}
        <IconBreadCrumbs id={id} codeBlock={codeBlock} />
      </div>
      <div className="code-container">
        <Snackbar
          open={!!notification}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity="info"
            sx={{ width: "100%" }}
          >
            {notification}
          </Alert>
        </Snackbar>
        {showSmiley && <Smiley />} {/* Render smiley if showSmiley is true */}
        <CodeBlockDetails codeBlock={codeBlock} isMentor={isMentor} />
        <CodeBlockEditor
          value={editorValue}
          onChange={handleCodeChange}
          readOnly={isMentor}
        />
      </div>
    </div>
  );
};

export default CodeBlockPage;
