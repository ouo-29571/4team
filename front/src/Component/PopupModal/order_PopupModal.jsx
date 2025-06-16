import { useEffect, useState } from "react";
import "./order_PopupModal.css";
import { useNavigate } from "react-router-dom";

const order_PopupModal = ({ productName, count, productPrice, closeModal }) => {
    const navigate = useNavigate();

    const handleClose = () => {
        closeModal(false);
    };

    return (
        <div className="popup-overlay">
            <div className="cart_popup-modal">
                {" "}
                {/* 팝업 큰 틀 */}
                <button className="popup-close-button" onClick={handleClose}>
                    X
                </button>
                <div className="popup-content">
                    {/* 팝업 내용 */}
                    <div className="cart_popup_subject">
                        <span>✅ 장바구니에 추가되었습니다!</span>
                    </div>
                    <div className="cart_popup_content">
                        <span>
                            품명: {productName} <br />
                            수량: {count}개 <br />
                            가격: {productPrice.toLocaleString()}원 <br />
                            합계: {(count * productPrice).toLocaleString()}원
                        </span>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                navigate("/cart");
                            }}
                            className="cart_close_button"
                        >
                            장바구니로 이동하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default order_PopupModal;
