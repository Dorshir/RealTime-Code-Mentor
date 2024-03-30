import React from "react";
import CodeEditor from "./CodeEditor";
import "../Styles.css";

const CodeBlockEditor = ({ value, onChange, readOnly }) => {
  return (
    <div style={{ marginLeft: "40px", width: "650px" }}>
      <CodeEditor value={value} onChange={onChange} readOnly={readOnly} />
    </div>
  );
};

export default CodeBlockEditor;
