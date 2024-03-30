import React, { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../Styles.css";

const CodeEditor = ({ value, onChange, readOnly }) => {
  const textareaRef = useRef(null); // Ref to textarea element
  const [lines, setLines] = useState([]); // State to store lines of code

  // Update textarea content and lines state when value prop changes
  useEffect(() => {
    textareaRef.current.value = value;
    setLines(value.split("\n"));
  }, [value]);

  // Function to handle textarea onChange event
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setLines(newValue.split("\n"));
  };

  // Function to render line numbers
  const renderLineNumbers = () => {
    return lines.map((_, index) => (
      <div key={index} className="line-numbers">
        {index + 1}
      </div>
    ));
  };

  // Render the CodeEditor component
  return (
    <div className="code-editor-container">
      <span className="background-overlay" />
      <div className="line-numbers-container">{renderLineNumbers()}</div>
      <div className="code-content">
        <SyntaxHighlighter
          language="javascript"
          style={docco}
          className="code-highlighter"
        >
          {value}
        </SyntaxHighlighter>
        <textarea
          ref={textareaRef}
          onChange={handleChange}
          className="code-textarea"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
