import React, { useEffect, useState } from 'react';

const images = [
  {
    src: '/img/main_bg.png',
    text: '최대 50% \n 할인쿠폰',
    button: '쿠폰 할인 받기',
  },
  {
    src: '/img/main_bg2.png',
    text: '한정 기간 \n 프로모션!',
    button: '지금 확인하기',
  },
];

export default function MainSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3초마다 슬라이드

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mainbox">
      <div className="main-imgbox">
        <img className="main-img" src={images[currentIndex].src} alt="슬라이드 이미지" />

        <h1 className="main-text">
          {images[currentIndex].text.split(' \n ').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h1>

        <div className="main-text2box">
          {images[currentIndex].button}
        </div>
      </div>
    </div>
  );
}
