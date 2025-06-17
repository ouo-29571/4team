import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [login_form, setLogin_form] = useState({
        login_email: "",
        login_password: "",
    });
    const [login_error, setLogin_error] = useState("");

    useEffect(() => {
        //로그인되어있는 상태에서 로그인페이지로 이동할 시 전 페이지로 이동하도록
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            navigate(-1);
        }
    }, []);

    //login_form 값 업데이트
    const handleChange_Login = (e) => {
        const { id, value } = e.target;
        setLogin_form((prev) => ({ ...prev, [id]: value }));
        console.log("데이터저장");
    };

    //로그인버튼 클릭 시 수행
    const handleLogin_Submit = async (e) => {
        e.preventDefault();

        //입력이 없을경우
        if (!login_form.login_email || !login_form.login_password) {
            setLogin_error("이메일 또는 비밀번호를 입력하세요.");
        } else {
            //에러문구 삭제후 DB 값 전달
            setLogin_error("");
            const response = await fetch("http://localhost:8080/login_submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(login_form),
            });

            //받은 값 활용
            const data = await response.json();
            if (data.login_check && response.ok) {
                //로그인 성공시 실행
                const userData = {
                    id: data.login_userid,
                    name: login_form.login_email,
                    token: login_form.login_password,
                };
                sessionStorage.setItem("user", JSON.stringify(userData));
                sessionStorage.removeItem("email");

                navigate("/");
                //새로고침
                window.location.reload();
            } else {
                setLogin_error("이메일 또는 비밀번호가 일치하지 않습니다.");
            }
        }
    };

    return (
        <>
            <div className="login_page">
                {/* 상단 헤더 */}
                <div></div>
                {/* 카테고리 */}
                <div className="login">
                    <div className="login_logo">
                        <img src="/img/logo2.png" />
                        <div className="login_logo_text">vintage haus</div>
                    </div>
                    <div>
                        <form
                            className="loginform"
                            onSubmit={handleLogin_Submit}
                        >
                            {/*이메일 입력 */}
                            <div className="contentWrap">
                                <input
                                    type="email"
                                    id="login_email"
                                    value={login_form.login_email}
                                    onChange={handleChange_Login}
                                    placeholder="이메일을 입력하세요"
                                ></input>
                            </div>
                            {/* 비밀번호 입력 */}
                            <div className="contentWrap">
                                <input
                                    type="password"
                                    id="login_password"
                                    value={login_form.login_password}
                                    onChange={handleChange_Login}
                                    placeholder="비밀번호를 입력하세요"
                                ></input>
                            </div>
                            {login_error && (
                                <div className="Login_error">{login_error}</div>
                            )}
                            <button type="submit" className="Login_button">
                                로그인
                            </button>
                        </form>
                    </div>
                    <div className="Login_find">
                        <div>
                            <Link to="/signup">회원가입</Link>
                        </div>
                        <div>
                            <span>|</span>
                        </div>
                        <div>
                            <Link to="/Passwordfind">비밀번호찾기</Link>
                        </div>
                    </div>
                </div>
                {/* 하단 */}
            </div>
        </>
    );
};

export default Login;
