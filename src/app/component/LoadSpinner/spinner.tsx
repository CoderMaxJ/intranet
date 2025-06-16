import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="loading-overlay d-flex justify-content-center align-items-center"
      role="status"
      aria-label="Loading"
    >
      <div className="spinner-border text-primary">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;