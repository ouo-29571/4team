import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Passwordfix.css";

const passwordfix = () => {
    const navigate = useNavigate();

    const [Passwordfix, setPasswordfix] = useState("");
    const [Passwordfix_confirm, setPasswordfix_confirm] = useState("");
    const [Passwordfix_error, setPasswordfix_error] = useState("");

    //비밀번호 저장
    const handleChang_Passwordfind = (e) => {
        setPasswordfix_error("");
        setPasswordfix(e.target.value);
    };

    //재확인 비밀번호 저장
    const handleChang_Passwordfind_confirm = (e) => {
        setPasswordfix_error("");
        setPasswordfix_confirm(e.target.value);
    };

    //수정된 비밀번호 DB에 전송
    const handleClick_passwrodfix = async (e) => {
        e.preventDefault();
        if (Passwordfix == "") {
            setPasswordfix_error("비밀번호를 입력하지 않았습니다.");
        } else if (Passwordfix != Passwordfix_confirm) {
            setPasswordfix_error("비밀번호가 일치하지 않습니다.");
        } else {
            const user = sessionStorage.getItem("user");
            const user_json = JSON.parse(user);
            const user_email = user_json.email;

            const response = await fetch("http://localhost:8080/Passwordfix", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Passwordfix, user_email }),
            });

            const data = await response.json();
            if (data.Passwordfix_result == true) {
                //비밀번호 수정 페이지 연결
                navigate("/Login");
            }
        }
    };

    return (
        <>
            <div className="Passwordfix_page">
                <div className="Passwordfix_main">
                    <div>
                        <div className="passwrodfix_logo">
                            <img src="../img/free-icon-logo-5448104.png" />
                        </div>
                        <div>
                            <label
                                htmlFor="Passwordfix"
                                className="Passwordfix_subject"
                            >
                                비밀번호 수정
                            </label>
                        </div>
                    </div>
                    <form onSubmit={handleClick_passwrodfix}>
                        <div className="Passwordfix_input">
                            <input
                                type="password"
                                id="Passwordfix"
                                value={Passwordfix}
                                onChange={handleChang_Passwordfind}
                                placeholder="비밀번호를 입력해주세요"
                            />
                        </div>
                        <div className="Passwordfix_input">
                            <input
                                type="password"
                                id="Passwordfix_confirm"
                                value={Passwordfix_confirm}
                                onChange={handleChang_Passwordfind_confirm}
                                placeholder="비밀번호를 다시 입력해주세요"
                            />
                        </div>
                        <div>
                            {Passwordfix_error && (
                                <div className="Password_error">
                                    {Passwordfix_error}
                                </div>
                            )}
                            <button className="Passwordfix_btn">수정</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default passwordfix;
