import React, { useEffect, useState, useRef, useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../Styles.css";

const CodeEditor = ({ value, onChange, readOnly }) => {
  const [lines, setLines] = useState([]); // State to store lines of code
  const textareaRef = useRef(null); // Ref to textarea element
  const cursorPositionRef = useRef(null); // Ref to store cursor position

  // Memoize the rendered line numbers
  const renderedLineNumbers = useMemo(() => {
    return lines.map((_, index) => (
      <div key={index} className="line-numbers">
        {index + 1}
      </div>
    ));
  }, [lines]);

  // Update textarea content and lines state when value changes
  useEffect(() => {
    setLines(value.split("\n"));
  }, [value]);

  // Function to handle textarea onChange event
  const handleChange = (e) => {
    const newValue = e.target.value;
    cursorPositionRef.current = textareaRef.current.selectionStart;
    onChange(newValue);
    setLines(newValue.split("\n"));
  };

  // Function to handle textarea focus event
  const handleFocus = () => {
    if (cursorPositionRef.current !== null) {
      textareaRef.current.selectionStart = cursorPositionRef.current;
      textareaRef.current.selectionEnd = cursorPositionRef.current;
    }
  };

  // Render the CodeEditor component
  return (
    <div className="code-editor-container">
      <span className="background-overlay" />
      <div className="line-numbers-container">{renderedLineNumbers}</div>
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
          onFocus={handleFocus}
          className="code-textarea"
          readOnly={readOnly}
          value={value}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
