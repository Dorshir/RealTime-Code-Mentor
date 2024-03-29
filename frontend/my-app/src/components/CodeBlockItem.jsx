import React from "react";
import { ListItemButton , ListItemText } from "@mui/material";
import { Link } from "react-router-dom"; 

const CodeBlockItem = ({ id, title }) => {
  return (
    <ListItemButton 
      component={Link}
      to={`/code-block/${id}`}
      className="code-block-item" 
    >
      <ListItemText primary={title}/>
    </ListItemButton >
  );
};

export default CodeBlockItem;
