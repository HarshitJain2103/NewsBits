import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const PaginationBullets = ({ currentPage, totalPages, onPageChange , isDarkMode}) => {
  const containerRef = useRef(null);

  const bulletWidth = 16;
  const bulletMargin = 6;
  const totalBulletWidth = bulletWidth + bulletMargin;

  const visibleBulletCount = 5;
  const totalWidth = totalPages * totalBulletWidth;
  const visibleWidth = visibleBulletCount * totalBulletWidth;
  const maxSlide = totalWidth - visibleWidth;

  const bullets = [];

  for (let i = 1; i <= totalPages; i++) {
    const distance = Math.abs(currentPage - i);

    // Scale and opacity based on distance from current page
    let scale = 1;
    let opacity = 1;

    if (distance === 1) {
      scale = 0.85;
      opacity = 0.7;
    } else if (distance === 2) {
      scale = 0.7;
      opacity = 0.5;
    } else if (distance >= 3) {
      scale = 0.5;
      opacity = 0.3;
    }

    const isActive = i === currentPage;

    bullets.push(
      <motion.div
        key={i}
        onClick={() => onPageChange(i)}
        whileTap={{ scale: 0.9 }}
        animate={{ scale, opacity }}
        transition={{ duration: 0.25 }}
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: isActive ? `${isDarkMode? '#ffffff' : '#343a40'}` : `${isDarkMode? '#e1dddc' : '#adb5bd'}`,
          cursor: "pointer",
          margin: "0 6px",
          flexShrink: 0,
        }}
        title={`Page ${i}`}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: `${visibleBulletCount * totalBulletWidth + 8}px`,
        overflow: "hidden",
        margin: "auto",
        padding: "10px 0",
      }}
    >
      <motion.div
        drag="x"
        dragConstraints={{
          left: -maxSlide,
          right: 0,
        }}
        dragElastic={0.01}
        style={{
          display: "flex",
          width: `${totalWidth}px`,
          cursor: "grab",
        }}
        dragMomentum={false}
      >
        {bullets}
      </motion.div>
    </div>
  );
};

export default PaginationBullets;
