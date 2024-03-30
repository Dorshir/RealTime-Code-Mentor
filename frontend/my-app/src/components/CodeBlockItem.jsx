import React from "react";
import { ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const colors = [
  "#f8a5c2", // Light Pink
  "#c3bef0", // Light Lavender
  "#fad390", // Light Yellow
  "#ffcccc", // Light Rose
  "#ffdd59", // Light Yellow
  "#c8d6e5", // Light Grayish Blue
  "#ff7979", // Light Coral
  "#b8e994", // Light Green
  "#f6e58d", // Light Pastel Yellow
  "#f3a683", // Light Salmon
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const CodeBlockItem = ({ id, title }) => {
  const randomColor = getRandomColor();

  return (
    <ListItemButton
      component={Link}
      to={`/code-block/${id}`}
      className="code-block-item"
      sx={{
        marginBottom: "10px",
        borderRadius: "25px",
        "&:hover": {
          backgroundColor: randomColor, //Colorful hover effect
        },
      }}
    >
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

export default CodeBlockItem;
