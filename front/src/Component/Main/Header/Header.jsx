import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const goToMenu = () => {
    navigate("/Menu"); // ✅ 메뉴 페이지 이동 함수
  };
  return (
    <div>
      <div className="headerbox">
        {" "}
        {/* ✅ 헤더*/}
        <p className="headertext">최대 50% 할인쿠폰</p>
      </div>
      <div className="navbox">
        <div className="nav-left">
          <button onClick={goToMenu}>
            <img className="icon" src="/img/메뉴.png" alt="menu" />
          </button>
        </div>

        <div className="nav-center">
          <h1 className="logo">vintage haus</h1>
        </div>

        <div className="nav-right">
          <img className="icon" src="/img/검색.png" alt="search" />
          <img className="icon" src="/img/회원.png" alt="user" />
          <img className="icon" src="/img/장바구니.png" alt="cart" />
        </div>
      </div>
    </div>
  );
};

export default Header;
