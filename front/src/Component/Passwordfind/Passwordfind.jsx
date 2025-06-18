import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Passwordfind.css";
import PasswordPopupModal from "../PopupModal/password_PopupModal/password_PopupModal";

const Passwordfind = () => {
    const navigate = useNavigate();

    const [Passwordfind_email, setPasswordfind_email] = useState("");
    const [Passwordfind_error, setPasswordfind_error] = useState("");

    //오류 팝업창
    const [showpasswordModal, setShowpasswordModal] = useState(false);

    const handleChang_Passwordfind = (e) => {
        setPasswordfind_error("");
        setPasswordfind_email(e.target.value);
        console.log("데이터 전송");
    };

    const handleClick_passwrodfind = async (e) => {
        e.preventDefault();
        if (Passwordfind_email !== "") {
            const response = await fetch("http://localhost:8080/Passwordfind", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Passwordfind_email }),
            });

            const data = await response.json();
            if (data.Passwordfind_result === true) {
                //비밀번호 수정 페이지 연결
                const userData = {
                    email: Passwordfind_email,
                };
                sessionStorage.setItem("email", JSON.stringify(userData));
                navigate("/Passwordfix");
            } else {
                setShowpasswordModal(true);
            }
        } else {
            setPasswordfind_error("이메일을 입력해주세요");
        }
    };

    const password_closeModal = () => {
        setShowpasswordModal(false);
    };

    return (
        <>
            {showpasswordModal && (
                <PasswordPopupModal closeModal={password_closeModal} />
            )}
            <div className="Passwordfind_page">
                <div className="Passwordfind_main">
                    <div>
                        <div>
                            <label
                                htmlFor="email"
                                className="Passwordfind_subject"
                            >
                                비밀번호 찾기
                            </label>
                        </div>
                    </div>
                    <form onSubmit={handleClick_passwrodfind}>
                        <div className="Passwordfind_email">
                            <input
                                type="email"
                                id="email"
                                value={Passwordfind_email}
                                onChange={handleChang_Passwordfind}
                                placeholder="이메일을 입력해주세요"
                            />
                        </div>
                        <div>
                            {Passwordfind_error && (
                                <div className="Password_error">
                                    {Passwordfind_error}
                                </div>
                            )}
                            <button className="Passwordfind_btn">찾기</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Passwordfind;
