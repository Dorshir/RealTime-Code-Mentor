import React, { useEffect, useState, useMemo } from "react";
import { Typography, List, CircularProgress } from "@mui/material";
import fetchCodeBlocksFromFirebase from "../utils/fetchCodeBlocksFromFirebase";
import CodeBlockItem from "../components/CodeBlockItem";
import "../Styles.css";

const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState(null); // Initialize as null

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCodeBlocks = await fetchCodeBlocksFromFirebase();
        setCodeBlocks(fetchedCodeBlocks);
      } catch (error) {
        console.error("Error fetching code blocks:", error);
        setCodeBlocks([]); // Set to empty array in case of error
      }
    };
    fetchData();
  }, []);

  return (
    <div className="lobby-container">
      <Typography variant="h4" className="choose-code-block">
        Choose Code Task
      </Typography>
      {codeBlocks === null ? (
        <div className="loading-container">
        <CircularProgress />
      </div>
      ) : (
        <List>
          {codeBlocks.map((block) => (
            <CodeBlockItem key={block.id} id={block.id} title={block.title} />
          ))}
        </List>
      )}
    </div>
  );
};

export default LobbyPage;
