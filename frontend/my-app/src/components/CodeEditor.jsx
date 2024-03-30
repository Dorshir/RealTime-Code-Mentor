import React, { useEffect, useState, useRef } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../Styles.css";
import { debounce } from "lodash";

const CodeEditor = ({ value, onChange, readOnly }) => {
  const [lines, setLines] = useState([]); // State to store lines of code
  const textareaRef = useRef(null); // Ref to textarea element
  const cursorPositionRef = useRef(null); // Ref to store cursor position

  // Debounce the handleChange function
  const debouncedOnChange = debounce((newValue) => {
    onChange(newValue);
  }, 300); // Adjust debounce delay as needed

  // Update textarea content and lines state when value prop changes
  useEffect(() => {
    setLines(value.split("\n"));
  }, [value]);

  // Function to handle textarea onChange event
  const handleChange = (e) => {
    const newValue = e.target.value;

    // Save the cursor position
    cursorPositionRef.current = textareaRef.current.selectionStart;

    // Update the lines state if needed
    setLines(newValue.split("\n"));

    // Call debounced onChange to update the value
    debouncedOnChange(newValue);
  };

  // Function to render line numbers
  const renderLineNumbers = () => {
    return lines.map((_, index) => (
      <div key={index} className="line-numbers">
        {index + 1}
      </div>
    ));
  };

  // Function to handle textarea focus event
  const handleFocus = () => {
    // Restore the cursor position if it's saved
    if (cursorPositionRef.current !== null) {
      textareaRef.current.selectionStart = cursorPositionRef.current;
      textareaRef.current.selectionEnd = cursorPositionRef.current;
    }
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
