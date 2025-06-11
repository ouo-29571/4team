import Image1 from "../Product/Object_Image/Image1.png";
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
import { useNavigate, useParams } from "react-router-dom";
function DetailPage() {
  const [count, setCount] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [inCart, setInCart] = useState(false);
  const rawUser = sessionStorage.getItem("user");
  const userId = rawUser ? JSON.parse(rawUser).id : null;
  const navigate = useNavigate();

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

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // console.log("서버에서 받아온 데이터 👉", data.product_name); // 👈 여기서 콘솔 찍힘
        setProduct(data);
        setProductId(data.product_id);
        setProductPrice(data.price);
        setProductName(data.product_name);
      })
      .catch((err) => console.error("fetch 오류", err));
  }, [id]);

  //장바구니 등록 여부 확인
  useEffect(() => {
    // if(!userId || !product) return;
    fetch('http://localhost:8080/cart/user_id', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        quantity: count,
        price: productPrice
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(`담기 실패:%{res.status}`);
        return res.json();
      })
      .then(json => {
        console.log("POST /cart 응답:", json);   // { success: true } 여야 합니다
        setInCart(false);
      })
    // .catch(err => {
    //   console.error(err);
    //   alert(err.message);
    // });
  });

  // 장바구니 담기
  const toggleCart = () => {
    if (!userId) return alert("로그인 후 이용해주세요.");
    const url = "http://localhost:8080/cart";
    console.log("▶️ toggleCart 호출, url:", url, "userId:", userId, "productId:", product.product_id);
    if (!inCart) {
      // 담기
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity: count,
          price: productPrice
        })
      })
        .then(res => {
          if (!res.ok) throw new Error("장바구니 담기 실패");
          setInCart(false);
          alert(
            `✅장바구니에 추가되었습니다! \n`+
            `품명: ${productName}\n`+
            `수량: ${count}개\n`+
            `가격: ${productPrice.toLocaleString()}원\n`+
            `===========================\n`+
            `합계: ${(count*productPrice).toLocaleString()}원`
          );
        })
        .catch(err => alert(err.message));
    }
  };

  const buyNow = () => {
    if (!userId) return alert("로그인 후 이용해주세요.");
    const orderData = {
      name: productName,
      quantity: count,
      price: product.price,
      product_id: productId
    };
    // console.log("orderData:" + orderData.name);
    navigate('/order', { state: { items: [orderData] } });
  };

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
            {product.product_id && images[product.product_id] ? (
              <img
                src={images[product.product_id]}
                alt={product.product_name}
                style={{ width: "600px", height: "600px" }}
              />
            ) : (
              <span>이미지 없음</span>
            )}
          </div>

          <div className="Product_Scroll">
            <div className="Thumb">DB사</div>
            <div className="Thumb">DB진</div>
            <div className="Thumb">DB첩</div>
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
            <button onClick={toggleCart}>
              {inCart ? "장바구니 빼기" : "장바구니 담기"}
            </button>
            <button onClick={() => buyNow(navigate)}>바로구매</button>
          </div>
        </div>
      </div>
      <div className="Product_DetailPage">
        <div className="Product_Coupon">
          첫 구매 시 99% 할인
          <button style={{ width: "100px" }}>쿠폰</button>
        </div>
        <div className="Product_Detail">DB상세내용테스트중입니다</div>
      </div>
    </>
  );
}

export default DetailPage;
