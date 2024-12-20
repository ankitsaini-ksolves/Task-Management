import React from "react";
import "../App.css";

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header justify-content-end">
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
