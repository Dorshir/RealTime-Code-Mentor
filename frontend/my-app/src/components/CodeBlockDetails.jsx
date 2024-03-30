import React, { Fragment } from "react";
import "../Styles.css";

const CodeBlockDetails = ({ codeBlock, isMentor }) => {
  /**
   * Function to render examples of the code block.
   * Renders each example with its index and a horizontal rule.
   * @returns {JSX.Element} - JSX element containing rendered examples.
   */
  const renderExamples = () => {
    return (
      <div className="code-description">
        {codeBlock?.["i/o examples"]?.map((example, index) => (
          <Fragment key={index}>
            {index % 2 === 0 && <p>Example {Math.floor(index / 2) + 1}:</p>}
            <p
              style={{
                fontWeight: "bold",
                marginLeft: "30px",
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              {example}
            </p>
            {(index + 1) % 2 === 0 &&
              index !== codeBlock["i/o examples"].length - 1 && (
                <hr style={{ marginTop: "20px" }} />
              )}
          </Fragment>
        ))}
      </div>
    );
  };

  // Render the CodeBlockDetails component
  return (
    <div className="code-details">
      <h1 className="code-title">{codeBlock?.title}</h1>
      <p className="user-role">
        <span
          style={{
            backgroundColor: isMentor ? "blue" : "green",
          }}
        ></span>
        {isMentor ? "Mentor" : "Student"}
      </p>
      <div className="code-description">{codeBlock?.details}</div>
      {renderExamples()}
    </div>
  );
};

export default CodeBlockDetails;
