import React, { useState } from "react";
import "./ImageSlider.css";

const ImageSlider = () => {
  // 이미지 배열 (인테리어 이미지들)
  const images = [
    "/img/인테리어1.png",
    "/img/인테리어2.png",
    "/img/인테리어3.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="itr-box">
      <img
        src="/img/left-arrow.png"
        alt="왼쪽 화살표"
        className="arrow-button"
        onClick={prevImage}
      />
      <img
        className="itr-img"
        src={images[currentIndex]}
        alt={`인테리어 이미지 ${currentIndex + 1}`}
      />
      <img
        src="/img/right-arrow.png"
        alt="오른쪽 화살표"
        className="arrow-button"
        onClick={nextImage}
      />
    </div>
  );
};

export default ImageSlider;
