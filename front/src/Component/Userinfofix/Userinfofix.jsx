import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Userinfofix.css";

const Userinfofix = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [Phone, setPhone] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // 비밀번호 값 가져오기
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // 비밀번호, 비밀번호학인의 필드값 일치하는지 판단
    const handleBlurOrEnter = () => {
        if (password != confirmPassword) {
            setError("비밀번호가 일치하지 않습니다");
        } else {
            //에러문구 삭제
            setError("");
        }
    };

    //회원가입 버튼클릭 시 수정할 예정
    const handleSignup_Submit = (e) => {
        e.preventDefault();
        if (!error && password && confirmPassword) {
            console.log("회원가입 성공: ", { password });
            // 회원가입 처리 로직
        } else {
            console.log("회원가입 실패: 비밀번호 오류");
        }
    };
    return (
        <div>
            <div>
                <div className="signup_page">
                    <div>{/* 상단 헤더 추가 예정 */}</div>
                    {/* 회원가입 */}
                    <div className="signupcontainer">
                        <div className="signup_logo">
                            <img src="../img/free-icon-logo-5448104.png" />
                        </div>
                        <div>
                            <h2>회원정보 수정</h2>
                        </div>
                        <div>
                            <form
                                className="signupform"
                                onSubmit={handleSignup_Submit}
                            >
                                {/* DB에서 값 가져오기 */}
                                <div className="input-container">
                                    <div>
                                        <label htmlFor="email">이메일</label>
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            placeholder="이메일을 입력하세요"
                                            required /*필수 입력란*/
                                        />
                                    </div>
                                </div>
                                <div className="input-container">
                                    <div>
                                        <label htmlFor="password">
                                            비밀번호
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="비밀번호를 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-container">
                                    <div>
                                        <label htmlFor="confirmPassword">
                                            비밀번호 확인
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={
                                                handleConfirmPasswordChange
                                            }
                                            onBlur={handleBlurOrEnter}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    handleBlurOrEnter();
                                            }}
                                            placeholder="비밀번호를 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <p style={{ color: "red" }}>{error}</p>
                                )}
                                <div className="input-container">
                                    <div>
                                        <label htmlFor="email">이름</label>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            placeholder="이름을 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-container">
                                    <div>
                                        <label htmlFor="email">전화번호</label>
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={Phone}
                                            placeholder="전화번호를 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="submit_button">
                                    <button
                                        type="submit"
                                        className="signup_fix_button"
                                    >
                                        수정
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div>{/* footer추가예정 */}</div>
                </div>
            </div>
        </div>
    );
};

export default Userinfofix;
