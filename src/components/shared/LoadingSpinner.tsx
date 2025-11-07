import React from 'react';
import './LoadingSpinner.css';

export function LoadingSpinner() {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner" aria-label="Loading">
        <div className="spinner-circle"></div>
      </div>
    </div>
  );
}

