import React from "react";

const Smiley = ({ onClose }) => {
  return (
    <div className="smiley-container">
      <div className="smiley" onClick={onClose}>
        😊
      </div>
    </div>
  );
};

export default Smiley;
