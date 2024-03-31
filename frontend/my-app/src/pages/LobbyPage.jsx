import React, { useEffect, useState } from "react";
import { Typography, List, CircularProgress } from "@mui/material";
import fetchCodeBlocksFromFirebase from "../utils/fetchCodeBlocksFromFirebase";
import CodeBlockItem from "../components/CodeBlockItem";
import IconBreadCrumbs from "../components/IconBreadCrumbs";
import "../Styles.css";

const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch code blocks data from Firebase
        const fetchedCodeBlocks = await fetchCodeBlocksFromFirebase();
        // Set the fetched data to state
        setCodeBlocks(fetchedCodeBlocks);
      } catch (error) {
        console.error("Error fetching code blocks:", error);
        // Set codeBlocks to an empty array in case of error to prevent null value
        setCodeBlocks([]);
      }
    };
    // Trigger the data fetching function on component mount
    fetchData();
  }, []);

  return (
    <div>
      <IconBreadCrumbs />
      <div className="lobby-container">
        <Typography variant="h4" className="choose-code-block">
          Choose Code Task
        </Typography>
        {/* Conditionally render a loading spinner if codeBlocks is null */}
        {codeBlocks === null ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : (
          // Render the list of code blocks if codeBlocks is not null
          <List>
            {codeBlocks.map((block) => (
              // Render a CodeBlockItem component for each code block
              <CodeBlockItem key={block.id} id={block.id} title={block.title} />
            ))}
          </List>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
