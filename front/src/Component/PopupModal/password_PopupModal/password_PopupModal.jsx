import { useEffect, useState } from "react";

import "./Password_PopupModal.css";

const password_PopupModal = ({ closeModal }) => {
    const password_handleClick = () => {
        closeModal(false);
    };

    return (
        <div className="popup-overlay">
            <div className="password_popup-modal">
                {" "}
                {/* 팝업 큰 틀 */}
                <div className="popup-content">
                    {/* 팝업 내용 */}
                    <div className="Password_popup_subject">
                        <span>
                            입력하신 이메일로
                            <br />
                            비밀번호를 찾을 수 없습니다.
                        </span>
                    </div>
                    <div
                        className="password_popup_close_btn"
                        onClick={password_handleClick}
                    >
                        <button>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default password_PopupModal;
