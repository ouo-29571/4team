import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Mypage.css";

const mypage = () => {
    const navigate = useNavigate();

    //사용자 정보
    const [userName, setUserName] = useState(""); //사용자이름
    const [coupon_count, setcoupon_count] = useState(0); //쿠폰 수
    const [Wish_list, setWish_list] = useState(0);

    //사용자 주문
    const [user_order, setUser_order] = useState({
        payment: 0,
        delivery_ing: 0,
        delivery: 0,
    });

    //쿠폰 상세보기
    const [showcoupon, setShowcoupon] = useState(false);
    const [couponlist, setCouponlist] = useState([]);

    //사용자 이름 가져오기
    async function get_Username(email) {
        const response = await fetch("http://localhost:8080/Mypage_userName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ User_email: email }),
        });

        const data = await response.json();
        if (data.User_Name && response.ok) {
            setUserName(data.User_Name);
        } else {
            console.log("이름이 없습니다.");
        }
    }

    //쿠폰 수 가져오기
    async function get_Couponcount(email) {
        const response = await fetch(
            "http://localhost:8080/Mypage_couponcount",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_email: email }),
            }
        );

        const data = await response.json();
        setcoupon_count(data.count);
    }

    //쿠폰 정보 가져오기
    function get_Coupondata(email) {
        fetch("http://localhost:8080/Mypage_coupondata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_email: email }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCouponlist(data);
            });
    }

    //사용자별 찜 개수 가져오기
    async function get_wishlist(id) {
        const response = await fetch(
            "http://localhost:8080/Mypage_wishlist_count",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: id }),
            }
        );
        const data = await response.json();
        setWish_list(data.count);
    }

    //사용자 주문, 배송상태 가져오기
    async function get_Userorder(id) {
        const response = await fetch("http://localhost:8080/Mypage_userorder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id }),
        });
        const data = await response.json();
        setUser_order({
            payment: data.paymentcount,
            delivery_ing: data.delivery_ingcount,
            delivery: data.deliverycount,
        });
    }

    //마이페이지 클릭시 로그인상태가 아닐경우 로그인 페이지로
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!user || !user.token) {
            navigate("/Login");
        } else {
            get_Username(user.name);
            get_Couponcount(user.name);
            get_wishlist(user.id);
            get_Userorder(user.id);
        }
    }, []);

    //사용자주문 상세정보 열기
    const Click_userorder = () => {
        navigate("/History");
    };

    //쿠폰 상세정보 열기
    const toggle_coupon = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!showcoupon) {
            setShowcoupon(true);
            get_Coupondata(user.name);
        }
    };

    //쿠폰 상세정보 닫기
    const toggle_coupon_close = () => {
        setShowcoupon((prev) => !prev);
    };

    //찜 목록 클릭시 (수정할 목록 삭제할 수도)
    const handle_Wish_list = () => {
        navigate("/Wish_list");
    };

    return (
        <>
            <div className="Mypage_page">
                {/* 사용자 정보및 회원정보 수정 */}
                <div className="userinfo_box">
                    <div className="username_box">
                        {/* 대충 사용자 이미지 */}
                        <div className="userinfo_box_img">
                            <img src="/img/logo1.png" />
                        </div>
                        <div className="user_name">
                            <div>
                                <span className="DB_input_username">
                                    {userName}
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
                            <div>쿠폰</div>
                            <div>{coupon_count}</div>
                        </div>
                        <div onClick={handle_Wish_list}>
                            <div>찜 목록</div>
                            <div>{Wish_list}</div>
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
                                onClick={Click_userorder}
                            >
                                <div>더보기</div>
                            </div>
                        </div>
                        <div className="order_box">
                            <div>
                                <div>
                                    <span>{user_order.payment}</span>
                                </div>
                                <div>결제완료</div>
                            </div>
                            <div className="user_order_img">
                                <img src="../img/free-icon-right-arrow-271228.png" />
                            </div>
                            <div>
                                <div>
                                    <span>{user_order.delivery_ing}</span>
                                </div>
                                <div>배송 중</div>
                            </div>
                            <div className="user_order_img">
                                <img src="../img/free-icon-right-arrow-271228.png" />
                            </div>
                            <div>
                                <div>
                                    <span>{user_order.delivery}</span>
                                </div>
                                <div>배송완료</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 쿠폰 상세 내용 */}
                <div>
                    {showcoupon && (
                        <div className="user_info_details">
                            <div className="user_info_details_header">
                                <span>쿠폰</span>
                            </div>
                            <div>
                                {/* 쿠폰상세정보 */}
                                {couponlist.length === 0 ? (
                                    <div>
                                        <span>
                                            사용 가능한 쿠폰이 없습니다.
                                        </span>
                                    </div>
                                ) : (
                                    couponlist.map((coupon) => (
                                        <div
                                            key={coupon.discount_id}
                                            className="couponbox"
                                        >
                                            <div className="coupon_subject">
                                                {coupon.name}
                                            </div>
                                            <div className="coupon_content">
                                                {coupon.discount}
                                                <span>
                                                    {coupon.discount_type ===
                                                    "percent"
                                                        ? "%"
                                                        : "원"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
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
