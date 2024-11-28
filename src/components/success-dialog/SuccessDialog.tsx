import React from "react";
import '../comfirm-dialog/ConfirmDialog.scss'
import { Button } from "@mui/material";

const SuccessDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog-container">
        <button className="dialog-close-btn" onClick={onCancel}>
          &times;
        </button>
        <div className="dialog-content">
          <div className="dialog-icon">
            <img
              src="/icons/success.png" /* Replace with your exclamation icon path */
              alt="success"
              width={50}
            />
          </div>
          <h2 className="dialog-title">{title}</h2>
          <p className="dialog-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;
