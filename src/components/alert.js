import React, { useEffect } from 'react';
import './alert.css';

function Alert({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="custom-alert">
      {message}
    </div>
  );
}

export default Alert;
