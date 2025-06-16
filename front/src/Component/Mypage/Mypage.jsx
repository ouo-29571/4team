import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import images from "../Menu/Product/productimg.jsx";
import "./Mypage.css";

const mypage = () => {
    const navigate = useNavigate();

    //사용자 정보
    const [userName, setUserName] = useState(""); //사용자이름
    const [coupon_count, setcoupon_count] = useState(0); //쿠폰 수
    const [Wishcount, setWishcount] = useState(0); //찜 수

    //사용자 주문
    const [user_order, setUser_order] = useState({
        payment: 0,
        delivery_ing: 0,
        delivery: 0,
    });

    //쿠폰 상세보기
    const [showcoupon, setShowcoupon] = useState(false);
    const [couponlist, setCouponlist] = useState([]);

    //위시리스트 상세보기
    const [showwish, setShowwish] = useState(false);
    const [wishlist, setWishlist] = useState([]);

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
    async function get_Couponcount(id) {
        const response = await fetch(
            "http://localhost:8080/Mypage_couponcount",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: id }),
            }
        );

        const data = await response.json();
        setcoupon_count(data.count);
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
        setWishcount(data.count);
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
            get_Couponcount(user.id);
            get_wishlist(user.id);
            get_Userorder(user.id);
        }
    }, []);

    //사용자주문 상세정보 열기
    const Click_userorder = () => {
        navigate("/History");
    };

    //쿠폰 정보 가져오기
    function get_Coupondata(id) {
        fetch("http://localhost:8080/Mypage_coupondata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCouponlist(data);
            });
    }

    //쿠폰 상세정보 열기
    const toggle_coupon = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!showcoupon) {
            setShowcoupon(true);
            get_Coupondata(user.id);
        }
    };

    //쿠폰 상세정보 닫기
    const toggle_coupon_close = () => {
        setShowcoupon((prev) => !prev);
    };

    //찜 정보 가져오기
    function get_wishdata(id) {
        fetch("http://localhost:8080/Mypage_wishdata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id }),
        })
            .then((res) => res.json())
            .then((data) => {
                setWishlist(data);
            });
    }

    //찜 목록 상세정보 열기
    const toggle_wishlist = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!showwish) {
            setShowwish(true);
            get_wishdata(user.id);
        }
    };

    //찜 목록 상세정보 닫기
    const toggle_wishlist_close = () => {
        setShowwish((prev) => !prev);
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
                        <div onClick={toggle_wishlist}>
                            <div>찜 목록</div>
                            <div>{Wishcount}</div>
                        </div>
                    </div>
                </div>
                <div className="user_order_menu">
                    <div className="user_order_table">
                        <div className="user_order_table_header">
                            <div className="user_oder_table_subject">
                                <span>주문 / 배송조회</span>
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
                            <div
                                className="use_order"
                                onClick={Click_userorder}
                            >
                                <span>더보기</span>
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
                                <button
                                    onClick={toggle_coupon_close}
                                    className="user_info_details_close"
                                >
                                    닫기
                                </button>
                            </div>
                            <div>
                                {/* 쿠폰상세정보 */}
                                {couponlist.length === 0 ? (
                                    <div className="list_empty">
                                        <span>
                                            사용 가능한 쿠폰이 없습니다.
                                        </span>
                                    </div>
                                ) : (
                                    couponlist.map((coupon) => (
                                        <div
                                            key={coupon.discount_id}
                                            className="detailbox"
                                        >
                                            <div className="coupon_subject">
                                                {coupon.name}
                                            </div>
                                            <div className="coupon_content">
                                                {coupon.discount.toLocaleString()}
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
                        </div>
                    )}
                </div>
                {/* 위시리스트 */}
                <div>
                    {showwish && (
                        <div className="user_info_details">
                            <div className="user_info_details_header">
                                <span>찜 목록</span>
                                <button
                                    onClick={toggle_wishlist_close}
                                    className="user_info_details_close"
                                >
                                    닫기
                                </button>
                            </div>
                            <div>
                                {/* 찜목록 상세정보 */}
                                {wishlist.length === 0 ? (
                                    <div className="list_empty">
                                        <span>찜 목록이 없습니다</span>
                                    </div>
                                ) : (
                                    wishlist.map((wish) => (
                                        <div
                                            key={wish.product_id}
                                            className="detailbox"
                                        >
                                            <Link
                                                to={`/DetailPage/${wish.product_id}`}
                                            >
                                                <div className="wishbox">
                                                    <img
                                                        src={
                                                            images[
                                                                wish.product_id
                                                            ]
                                                        }
                                                        alt={wish.product_name}
                                                        height="200"
                                                        width="200"
                                                    />
                                                    <div className="wish_content">
                                                        <span className="wish_productname">
                                                            {wish.product_name}
                                                        </span>
                                                        <span className="wish_productprice">
                                                            {wish.price.toLocaleString()}
                                                            원
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default mypage;
