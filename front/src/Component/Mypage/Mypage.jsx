import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Mypage.css";

const mypage = () => {
    //사용자 정보
    const [username, setUsername] = useState("user");
    const [coupon, setCoupon] = useState(0);
    const [bookmark, setBookmark] = useState(0);

    //사용자 주문
    const [payment, setPayment] = useState(0);
    const [delivery_ing, setDelivery_ing] = useState(0);
    const [delivery, setDelivery] = useState(0);

    //사용자 주문 상세보기
    const [showuserorder, setUserorder] = useState(false);

    //쿠폰 상세보기
    const [showcoupon, setShowcoupon] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    //사용자주문 상세정보 열기
    //페이드 인 아웃.. 별로인것 같기도
    const toggle_userorder = () => {
        // setUserorder((prev) => !prev);
        if (!showuserorder) {
            setUserorder(true);
        }
    };

    //사용자주문 상세정보 닫기
    const toggle_userorder_close = () => {
        // setUserorder((prev) => !prev);
        setIsFadingOut(true);
        setTimeout(() => {
            setUserorder(false);
            setIsFadingOut(false);
        }, 500);
    };

    //쿠폰 상세정보 열기
    const toggle_coupon = () => {
        //setShowcoupon((prev) => !prev);
        if (!showcoupon) {
            setShowcoupon(true);
        }
    };

    //쿠폰 상세정보 닫기
    const toggle_coupon_close = () => {
        // setShowcoupon((prev) => !prev);
        setIsFadingOut(true);
        setTimeout(() => {
            setShowcoupon(false);
            setIsFadingOut(false);
        }, 500);
    };

    return (
        <>
            <div className="Mypage_page">
                <div className="userinfo_box">
                    <div className="username_box">
                        {/* 대충 사용자 이미지 */}
                        <div className="userinfo_box_img">
                            <img src="../img/free-icon-profile-9344418.png" />
                        </div>
                        <div className="user_name">
                            <div>
                                <span className="DB_input_username">
                                    {username}
                                </span>
                                <span>님</span>
                            </div>
                            <div className="Userinfo_fix_Link">
                                <Link to="/Userinfofix">
                                    <span>회원정보 수정</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="user_simpleinfo">
                        <div onClick={toggle_coupon}>
                            <div>
                                <span>쿠폰:</span>
                            </div>
                            <div>
                                <span>{coupon}</span>
                            </div>
                        </div>
                        <div>
                            {/* 수정사항 */}
                            <div>
                                <span>찜 목록:</span>
                            </div>
                            <div>
                                <span>{bookmark}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user_order_menu">
                    <div className="user_order_table">
                        <div className="user_order_table_header">
                            <div className="user_oder_table_subject">
                                <span>주문 / 배송조회</span>
                            </div>
                            <div
                                className="use_order"
                                onClick={toggle_userorder}
                            >
                                <span>더보기</span>
                            </div>
                        </div>
                        <div className="order_box">
                            <div>
                                <div>
                                    <span>{payment}</span>
                                </div>
                                <div>
                                    <span>결제완료</span>
                                </div>
                            </div>
                            <div className="user_order_img">
                                <img src="../img/free-icon-right-arrow-271228.png" />
                            </div>
                            <div>
                                <div>
                                    <span>{delivery_ing}</span>
                                </div>
                                <div>
                                    <span>배송 중</span>
                                </div>
                            </div>
                            <div className="user_order_img">
                                <img src="../img/free-icon-right-arrow-271228.png" />
                            </div>
                            <div>
                                <div>
                                    <span>{delivery}</span>
                                </div>
                                <div>
                                    <span>배송완료</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 주문목록 */}
                <div>
                    {showuserorder && (
                        <div
                            className={`user_info_details ${
                                isFadingOut ? "fade-out" : "fade-in"
                            }`}
                        >
                            <div>
                                <div>
                                    {/* 주문목록 들어갈 예정 */}
                                    <span>임시 주문</span>
                                </div>
                                <div>
                                    {/* 주문목록 들어갈 예정 */}
                                    <span>임시 주문</span>
                                </div>
                            </div>
                            <div className="user_info_details_close">
                                <button onClick={toggle_userorder_close}>
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 쿠폰 상세 내용 */}
                <div>
                    {showcoupon && (
                        <div
                            className={`user_info_details ${
                                isFadingOut ? "fade-out" : "fade-in"
                            }`}
                        >
                            <div>
                                <span>쿠폰</span>
                            </div>
                            <div>
                                <div>
                                    <span>쿠폰1</span>
                                </div>
                                <div>
                                    <span>쿠폰2</span>
                                </div>
                            </div>
                            <div className="user_info_details_close">
                                <button onClick={toggle_coupon_close}>
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default mypage;
