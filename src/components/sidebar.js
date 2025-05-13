import React, { useState } from 'react';
import { FaTimes, FaBookmark, FaHistory, FaFireAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Alert from './alert.js';

function Sidebar({ isOpen, onClose, isDarkMode, user }) {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleSavedArticlesClick = () => {
    onClose();
    if (!user) {
      setShowAlert(true);
    } else {
      navigate('/saved');
    }
  };

  const handleHistoryClick = () => {
    onClose();
    if (!user) {
      setShowAlert(true);
    } else {
      navigate('/history');
    }
  };

  const menuItems = [
    {
      label: 'Saved Articles',
      icon: <FaBookmark />,
      onClick: handleSavedArticlesClick,
    },
    {
      label: 'History',
      icon: <FaHistory />,
      onClick: handleHistoryClick, // Updated to use handleHistoryClick
    },
    {
      label: 'Trending',
      icon: <FaFireAlt />,
      onClick: () => {
        onClose();
        navigate('/trending');
      },
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-320px',
          height: '100vh',
          width: '280px',
          background: isDarkMode
            ? 'linear-gradient(160deg, #1a1a1a, #2a2a2a)'
            : 'linear-gradient(160deg, #ffffff, #f8f9fa)',
          color: isDarkMode ? '#f1f1f1' : '#212529',
          transition: 'left 0.3s ease',
          zIndex: 9999,
          boxShadow: '4px 0 12px rgba(0,0,0,0.2)',
          padding: '1.5rem',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <FaUserCircle size={28} className="me-2" />
            <h5 className="mb-0" style={{ fontWeight: 600 }}>
              {user ? user.username : 'Guest'}
            </h5>
          </div>
          <FaTimes
            onClick={onClose}
            style={{ cursor: 'pointer', fontSize: '1.4rem' }}
            title="Close Sidebar"
          />
        </div>

        {/* Menu Items */}
        <ul className="list-unstyled">
          {menuItems.map((item, index) => (
            <li key={index} className="mb-3">
              <button
                onClick={item.onClick}
                className="d-flex align-items-center btn btn-link text-decoration-none w-100"
                style={{
                  color: isDarkMode ? '#f1f1f1' : '#212529',
                  fontSize: '16px',
                  fontWeight: 500,
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  transition: 'background 0.2s ease',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#333' : '#f0f0f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Custom Alert */}
      {showAlert && (
        <Alert
          message="Login/sign up to view saved articles or history."
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
