import React, { useState } from 'react';
import './Daycheck.css'; // 스타일은 여기서 관리할게

const Daycheck = ({ day }) => {
  const [stamped, setStamped] = useState(false);

  const handleClick = () => {
    setStamped(true); // 누르면 도장 opacity 100%
  };

  return (
    <div className="event-day-wrapper" onClick={handleClick}>
      <div className="stamp-image" style={{ opacity: stamped ? 1 : 0.2 }} />
      <div className="at-day">{day}</div>
    </div>
  );
};

export default Daycheck;
