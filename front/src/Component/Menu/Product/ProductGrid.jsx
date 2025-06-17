import images from "./productimg.jsx";
import Star from "./Star";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// src/components/ProductGrid.jsx
function ProductGrid({ items, isLoggedIn }) {
    const navigate = useNavigate();

    const [likedItems, setLikedItems] = useState({});

    async function wish_init(id) {
        const response = await fetch("http://localhost:8080/Mypage_wish_init", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id }),
        });
        const data = await response.json();
        //data 형식이 배열인 경우
        setLikedItems((prev) => {
            const updatedItems = { ...prev };
            data.product_id.forEach((product_id) => {
                updatedItems[product_id] = true; // 해당 product_id를 찜 상태로 설정
            });
            return updatedItems;
        });
    }

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            wish_init(user.id);
        }
    }, []);

    const toggleLike = async (id) => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            const updatedItems = { ...likedItems, [id]: !likedItems[id] }; // 상품의 찜 상태 토글
            console.log("Updated likedItems inside toggleLike:", updatedItems);

            // 상태 업데이트 후에 fetch 호출
            try {
                const response = await fetch(
                    `http://localhost:8080/api/products/${id}/like`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            likedItems: updatedItems[id], // 상태를 즉시 전달
                        }),
                    }
                );
                const data = await response.json();
                console.log("찜 상태 서버에 반영:", data);
            } catch (error) {
                console.error("서버 오류:", error);
            }

            // 상태를 나중에 업데이트
            setLikedItems(updatedItems);

            //wish테이블 저장
            const response = await fetch("http://localhost:8080/Mypage_Wish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    product_id: id,
                    likedItems: updatedItems[id],
                }),
            });
        } else {
            alert("로그인 후 찜할 수 있습니다.");
            navigate("/Login");
        }
    };

    return (
        <>
            {items.map((item) => (
                <div className="item" key={item.product_id}>
                    <div className="inner_up">
                        <img
                            className="inner_up_img"
                            src={images[item.product_id]}
                            alt={item.product_name}
                        />
                    </div>
                    <div className="inner_down">
                        <div className="inner_left_text">
                            <span
                                style={{ fontSize: "20px", fontWeight: "bold" }}
                            >
                                <Link to={`/DetailPage/${item.product_id}`}>
                                    {item.product_name}
                                </Link>
                            </span>
                            <br />
                            <div className="inner_left_text2">
                                {item.price.toLocaleString()}원{" "}
                            </div>
                            <br />
                            {/*  ⭐️⭐️⭐️⭐️⭐️ 버튼 */}
                            <Star productId={item.product_id} />
                        </div>
                        <div className="inner_right_heart">
                            <button
                                className={`inner_left_button ${
                                    likedItems[item.product_id] ? "active" : ""
                                }`}
                                onClick={() => {
                                    toggleLike(item.product_id);
                                }}
                            >
                                찜
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default ProductGrid;
