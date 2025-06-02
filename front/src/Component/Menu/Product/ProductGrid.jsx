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
import Image109 from "./Object_Image/Image109.png";

import Star from "./Star";
import React, { useState, useEffect } from "react";

// src/components/ProductGrid.jsx
function ProductGrid({ items }) {
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
    109: Image109,
  };

  const toggleLike = (id) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // 누른 버튼만 상태 변경
    }));
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
                {item.product_name}
              </span>
              <br />
              가격 : {item.price.toLocaleString()}원
              <br />
              리뷰: <Star />
            </div>
            <div className="inner_right_heart">
              {/* 🔴 찜 버튼 */}
              <button
                className={`inner_left_button ${
                  likedItems[item.product_id] ? "active" : "" // ⭐️ id → product_id
                }`}
                onClick={() => toggleLike(item.product_id)} // ⭐️ id → product_id
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
