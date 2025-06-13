import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
    const navigate = useNavigate();

    const [name, setname] = useState("");

    const goToMenu = () => {
        navigate("/Menu"); // ✅ 메뉴 페이지 이동 함수
    };
    const goToMain = () => {
        navigate("/");
    };

    const handleClick = () => {
        navigate("/EventPage");
    };

    const click_logout = () => {
        sessionStorage.removeItem("user");
        setname("");
        //새로고침
        window.location.reload();
    };

    async function get_Username(email) {
        const response = await fetch("http://localhost:8080/Header_userName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ User_email: email }),
        });

        const data = await response.json();
        if (data.Headername && response.ok) {
            setname(data.Headername);
        }
    }

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            get_Username(user.name);
        } else {
            setname("");
        }
    }, []);

    return (
        <div>
            <div
                onClick={handleClick}
                style={{ cursor: "pointer" }}
                role="button"
                className="headerbox"
            >
                {" "}
                {/* ✅ 헤더*/}
                <p className="headertext">최대 50% 할인쿠폰</p>
            </div>
            <div className="navbox">
                <div className="nav-left">
                    <button onClick={goToMenu}>
                        <img
                            className="icon-menu"
                            src="/img/메뉴.png"
                            alt="menu"
                        />{" "}
                        {/* ✅ 메뉴*/}
                    </button>
                </div>

                <div className="nav-center">
                    <button onClick={goToMain}>
                        <h1 className="logo">vintage haus</h1> {/* ✅ 로고*/}
                    </button>
                </div>

                <div className="nav-right">
                    {name === "" ? (
                        <>
                            <button
                                onClick={() => navigate("/Login")}
                                className="login-btn"
                            >
                                log in
                            </button>
                            <button
                                onClick={() => navigate("/Signup")}
                                className="signup-btn"
                            >
                                sine up
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="headername">
                                {name}님 환영합니다.
                            </span>
                            <button
                                onClick={click_logout}
                                className="logout-btn"
                            >
                                log out
                            </button>
                        </>
                    )}
                    <button onClick={() => navigate("/Mypage")}>
                        <img
                            className="icon-user"
                            src="/img/회원.png"
                            alt="user"
                        />{" "}
                        {/* ✅ 회원*/}
                    </button>

                    <button onClick={() => navigate("/Cart")}>
                        <img
                            className="icon-cart"
                            src="/img/장바구니.png"
                            alt="cart"
                        />{" "}
                        {/* ✅ 장바구니(카트)*/}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
