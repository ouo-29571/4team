//장식구
import Image1 from "./Object_Image/Image1.png";
import Image2 from "./Object_Image/Image2.png";
import Image3 from "./Object_Image/Image3.png";
import Image4 from "./Object_Image/Image4.png";
import Image5 from "./Object_Image/Image5.png";
import Image6 from "./Object_Image/Image6.png";
import Image7 from "./Object_Image/Image7.png";
import Image8 from "./Object_Image/Image8.png";
import Image9 from "./Object_Image/Image9.png";

import Image101 from "./Object_Image/Image101.png";
import Image102 from "./Object_Image/Image102.png";
import Image103 from "./Object_Image/Image103.png";
import Image104 from "./Object_Image/Image104.png";
import Image105 from "./Object_Image/Image105.png";
import Image106 from "./Object_Image/Image106.png";
import Image107 from "./Object_Image/Image107.png";
import Image108 from "./Object_Image/Image108.png";
import Image109 from "./Object_Image/Image109.png";

import Image201 from "./Object_Image/Image201.png";
import Image202 from "./Object_Image/Image202.png";
import Image203 from "./Object_Image/Image203.png";
import Image204 from "./Object_Image/Image204.png";
import Image205 from "./Object_Image/Image205.png";
import Image206 from "./Object_Image/Image206.png";
import Image207 from "./Object_Image/Image207.png";
import Image208 from "./Object_Image/Image208.png";
import Image209 from "./Object_Image/Image209.png";

import Star from "./Star";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// src/components/ProductGrid.jsx
function ProductGrid({ items, isLoggedIn }) {
  const [likedItems, setLikedItems] = useState({});

  const images = {
    1: Image1,
    2: Image2,
    3: Image3,
    4: Image4,
    5: Image5,
    6: Image6,
    7: Image7,
    8: Image8,
    9: Image9,
    101: Image101,
    102: Image102,
    103: Image103,
    104: Image104,
    105: Image105,
    106: Image106,
    107: Image107,
    108: Image108,
    109: Image109,
    201: Image201,
    202: Image202,
    203: Image203,
    204: Image204,
    205: Image205,
    206: Image206,
    207: Image207,
    208: Image208,
    209: Image209,
  };

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
    wish_init(user.id);
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
      navigate("/Login");
    }
  };

  return (
    <>
      {items.map((item) => (
        <div className="item" key={item.product_id}>
          <div className="inner_up">
            <img
              src={images[item.product_id]}
              alt={item.product_name}
              height="400"
              width="400"
            />
          </div>
          <div className="inner_down">
            <div className="inner_left_text">
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                <Link to={`/DetailPage/${item.product_id}`}>
                  {item.product_name}
                </Link>
              </span>
              <br />
              가격 : {item.price.toLocaleString()}원
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
                  // if (!isLoggedIn) {
                  //   alert("로그인 후 찜할 수 있습니다.");
                  //   return;
                  // }
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
