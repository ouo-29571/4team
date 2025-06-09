import Image1 from "../Product/Object_Image/Image1.png";
import Image1_2 from "../Product/Object_Image/Image1_2.png";
import Image2 from "../Product/Object_Image/Image2.png";
import Image3 from "../Product/Object_Image/Image3.png";
import Image4 from "../Product/Object_Image/Image4.png";
import Image5 from "../Product/Object_Image/Image5.png";
import Image6 from "../Product/Object_Image/Image6.png";
import Image7 from "../Product/Object_Image/Image7.png";
import Image8 from "../Product/Object_Image/Image8.png";
import Image9 from "../Product/Object_Image/Image9.png";

import Image101 from "../Product/Object_Image/Image101.png";
import Image102 from "../Product/Object_Image/Image102.png";
import Image103 from "../Product/Object_Image/Image103.png";
import Image104 from "../Product/Object_Image/Image104.png";
import Image105 from "../Product/Object_Image/Image105.png";
import Image106 from "../Product/Object_Image/Image106.png";
import Image107 from "../Product/Object_Image/Image107.png";
import Image108 from "../Product/Object_Image/Image108.png";
import Image109 from "../Product/Object_Image/Image109.png";

import Image201 from "../Product/Object_Image/Image201.png";
import Image202 from "../Product/Object_Image/Image202.png";
import Image203 from "../Product/Object_Image/Image203.png";
import Image204 from "../Product/Object_Image/Image204.png";
import Image205 from "../Product/Object_Image/Image205.png";
import Image206 from "../Product/Object_Image/Image206.png";
import Image207 from "../Product/Object_Image/Image207.png";
import Image208 from "../Product/Object_Image/Image208.png";
import Image209 from "../Product/Object_Image/Image209.png";
//jsdafhkjasdhfkjasdfh
import "./DetailPage.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
function DetailPage() {
  const [count, setCount] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const images = {
    1: [Image1, Image1_2],
    2: [Image2],
    3: [Image3],
    4: [Image4],
    5: [Image5],
    6: [Image6],
    7: [Image7],
    8: [Image8],
    9: [Image9],
    101: [Image101],
    102: [Image102],
    103: [Image103],
    104: [Image104],
    105: [Image105],
    106: [Image106],
    107: [Image107],
    108: [Image108],
    109: [Image109],
    201: [Image201],
    202: [Image202],
    203: [Image203],
    204: [Image204],
    205: [Image205],
    206: [Image206],
    207: [Image207],
    208: [Image208],
    209: [Image209],
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => console.error("fetch 오류", err));
  }, [id]);

  if (!product) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="Product_Top">
        <div className="Product_Box">
          {/*이미지*/}
          <div className="Product_Image">
            {product.product_id &&
            images[product.product_id] &&
            images[product.product_id][mainImageIndex] ? (
              <img
                src={images[product.product_id][mainImageIndex]}
                alt={product.product_name}
                style={{ width: "600px", height: "600px" }}
              />
            ) : (
              <span>이미지 없음</span>
            )}
          </div>

          <div className="Product_Scroll" style={{ cursor: "pointer" }}>
            {images[product.product_id].map((imgSrc, index) => (
              <div
                className="Thumb"
                key={index}
                onClick={() => setMainImageIndex(index)}
              >
                <img
                  src={imgSrc}
                  alt={`제품 썸네일 ${index + 1}`}
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="Product_Info">
          <div className="Product_Name">{product.product_name}</div>
          <div className="Product_Price-Box">
            <div className="Product_Price">
              <span>가격:</span>
              <span>{(product.price * count).toLocaleString()}</span>
            </div>
            <div className="Product_Quantity">
              수량:
              <div className="Product_Quantity_buttons">
                <button onClick={() => setCount(Math.max(count - 1, 1))}>
                  -
                </button>
                <span>{count}</span>
                <button onClick={() => setCount(count + 1)}>+</button>
              </div>
            </div>
          </div>
          <div className="Product_Buttons">
            <button>찜</button>
            <button>장바구니</button>
            <button>바로구매</button>
          </div>
        </div>
      </div>
      <div className="Product_DetailPage">
        <div className="Product_Coupon">
          첫 구매 시 99% 할인
          <button
            className="Product_Coupon_Button"
            onClick={() => alert("쿠폰이 발급되었습니다!")}
          >
            쿠폰
          </button>
        </div>
        <div
          style={{
            fontSize: "80px",
            fontWeight: 900,
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          {product.product_name}
        </div>
        <div
          style={{ fontSize: "50px", fontWeight: 500, marginBottom: "80px" }}
        >
          “어디서도 볼 수 없는 특별한 디자인.”
        </div>
        <div style={{ marginBottom: "40px" }}>
          {product.product_id &&
          images[product.product_id] &&
          images[product.product_id][0] ? (
            <img
              src={images[product.product_id][0]} // 배열의 첫 번째 이미지
              alt={product.product_name}
              style={{ width: "900px", height: "900px" }}
            />
          ) : (
            <span>이미지 없음</span>
          )}
        </div>
        <div className="Product_Detail">{product.field1}</div>
        <div className="Product_Detail">{product.field2}</div>
        <div className="Product_Detail">{product.field3}</div>
      </div>
    </>
  );
}

export default DetailPage;
