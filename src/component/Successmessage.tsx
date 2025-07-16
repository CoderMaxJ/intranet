"use client";
import React, { useState } from "react";

const SuccessMessage = () => {
  const [, setShowModal] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);
  
  const handleDeleteAccount = () => {
    setAccountDeleted(true);
    setShowModal(false);
  };

  const handleCancel = () => setShowModal(false);
  return (
    <div>
      <div className="modal">
        <div className="modal-content">
          <h2>Are you sure you want to delete this account?</h2>
          <button onClick={handleDeleteAccount}>Yes, Delete</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      {accountDeleted && (
        <div className="success-message">
          <p>Your account has been successfully deleted.</p>
        </div>
      )}
  
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          width: 300px;
        }

        .success-message {
          text-align: center;
          margin-top: 20px;
          color: green;
        }

        button {
          margin: 10px;
          padding: 10px;
          border: none;
          cursor: pointer;
          background-color: #4caf50;
          color: white;
          font-size: 16px;
        }

        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default SuccessMessage;
