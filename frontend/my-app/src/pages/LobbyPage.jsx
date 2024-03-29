import React, { useEffect, useState } from "react";
import { Typography, List } from "@mui/material";
import fetchCodeBlocksFromFirebase from "../utils/fetchCodeBlocksFromFirebase";
import CodeBlockItem from "../components/CodeBlockItem";
import "../Styles.css";

const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCodeBlocks = await fetchCodeBlocksFromFirebase();
      setCodeBlocks(fetchedCodeBlocks);
    };
    fetchData();
  }, []);

  return (
    <div className="centered-list-items">
      <Typography variant="h4" className="choose-code-block">
        Choose Code Task
      </Typography>
      <List
      >
        {codeBlocks.map((block) => (
          <CodeBlockItem key={block.id} id={block.id} title={block.title} />
        ))}
      </List>
    </div>
  );
};

export default LobbyPage;
