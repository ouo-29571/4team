import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const goToMenu = () => {
    navigate("/Menu"); // ✅ 메뉴 페이지 이동 함수
  }
  const goToMain = () => {
    navigate("/");
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
            <img className="icon-menu" src="/img/메뉴.png" alt="menu" /> {/* ✅ 메뉴*/}
          </button>
        </div>

        <div className="nav-center">
          <button onClick={goToMain}>
            <h1 className="logo">vintage haus</h1> {/* ✅ 로고*/}
          </button>
        </div>

        <div className="nav-right">
        <button>
        <img className="icon-search" src="/img/검색.png" alt="search" />  {/* ✅ 검색*/}
        </button>

        <button>
          <img className="icon-user" src="/img/회원.png" alt="user" />  {/* ✅ 회원*/}
        </button>

        <button>
          <img className="icon-cart" src="/img/장바구니.png" alt="cart" />  {/* ✅ 장바구니(카트)*/}
        </button>
        </div>

      </div>
    </div>
  );
};

export default Header;
