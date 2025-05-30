import Star from "./Star";
import React, { useState } from "react";

// src/components/ProductGrid.jsx
function ProductGrid({ items }) {
  const [likedItems, setLikedItems] = useState({});

  const toggleLike = (id) => {
    setLikedItems(prev => ({
      ...prev,
      [id]: !prev[id], // 누른 버튼만 상태 변경
    }));
  };



  return (
    <>
      {items.map((item) => (
        <div className="item" key={item.id}>
          <div className="inner_up">
            <img
              src={item.image}
              alt={item.name}
              height="400"
              width="400"

            />
          </div>
          <div className="inner_down">
            <div className="inner_left_text">
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>{item.name}</span>
              <br />
              가격 : {item.price.toLocaleString()}원
              <br />
              리뷰: <Star />
            </div>
            <div className="inner_right_heart">
              {/* 🔴 찜 버튼 */}
              <button
                className={`inner_left_button ${likedItems[item.id] ? 'active' : ''}`} onClick={() => toggleLike(item.id)}>
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
