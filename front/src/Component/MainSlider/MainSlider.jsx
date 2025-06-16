import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 리액트 라우터 훅 import

// ✅ 이미지 배열
const images = [
  {
    src: "/img/bg.png",
    text: "신규 회원 \n 혜택 받기",
    button: "혜택 확인하기",
    link: "/EventPage", // ✅ 다른 페이지도 가능
  },
  {
    src: "/img/main_bg2.png",
    text: "출석체크 하고 \n 쿠폰 받기",
    button: "출석 체크 하러 가기",
    link: "/EventPage", // ✅ 다른 페이지도 가능
  },
];

export default function MainSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // ✅ 네비게이션 함수

  // ✅ 슬라이드 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3초마다 슬라이드

    return () => clearInterval(interval);
  }, []);

  // ✅ 버튼 클릭 시 페이지 이동
  const goToEventPage = () => {
    const targetLink = images[currentIndex].link;
    if ("/EventPage") {
      navigate("/EventPage");
    }
  };

  return (
    <div className="mainbox">
      <div className="main-imgbox">
        <img
          className="main-img"
          src={images[currentIndex].src}
          alt="슬라이드 이미지"
        />

        <h1 className="main-text">
          {images[currentIndex].text.split(" \n ").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h1>

        <div className="main-text2box" onClick={goToEventPage}>
          {images[currentIndex].button}
        </div>
      </div>
    </div>
  );
}
