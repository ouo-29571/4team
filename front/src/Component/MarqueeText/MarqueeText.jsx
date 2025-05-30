import React from 'react';
import './MarqueeText.css';

export default function MarqueeText({
  text = "vintage haus",
  fontSize = "5vw",
  top = "0",
  bottom = "0",
}) {
  return (
    <div className="marquee-wrapper" style={{ marginTop: top, marginBottom: bottom }}>
      <div className="marquee-track" style={{ fontSize }}>
        <span>{`${text} `.repeat(6)}</span>
        <span>{`${text} `.repeat(6)}</span>
      </div>
    </div>
  );
}
