// ScrollbarDs.jsx
import React from 'react';
import './ScrollbarDs.css';

const ScrollbarDs = ({ children, style }) => {
  return (
    <div className="scrollbar-ds-container" style={style}>
      <div className="scrollbar-ds-content">
        {children}
      </div>
    </div>
  );
};

export default ScrollbarDs;
