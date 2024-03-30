import React, { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { debounce } from "lodash"; // Import debounce from lodash library
import "../Styles.css";

const CodeEditor = ({ value, onChange, readOnly }) => {
  const [lines, setLines] = useState([]); // State to store lines of code

  // Debounce the handleChange function
  const debouncedHandleChange = debounce((newValue) => {
    onChange(newValue); // Update the value
  }, 200); // Adjust debounce delay as needed (e.g., 300 milliseconds)

  // Function to handle textarea onChange event
  const handleChange = (e) => {
    const newValue = e.target.value;
    debouncedHandleChange(newValue); // Call debounced handleChange
    // setLines(newValue.split("\n")); // You can remove this line if not needed
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
          onChange={handleChange} // Call debounced handleChange
          className="code-textarea"
          readOnly={readOnly}
          value={value}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
