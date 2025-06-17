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
import Image101_2 from "../Product/Object_Image/Image101_2.png";
import Image102 from "../Product/Object_Image/Image102.png";
import Image102_2 from "../Product/Object_Image/Image102_2.png";
import Image103 from "../Product/Object_Image/Image103.png";
import Image103_2 from "../Product/Object_Image/Image103_2.png";
import Image104 from "../Product/Object_Image/Image104.png";
import Image104_2 from "../Product/Object_Image/Image104_2.png";
import Image105 from "../Product/Object_Image/Image105.png";
import Image105_2 from "../Product/Object_Image/Image105_2.png";
import Image106 from "../Product/Object_Image/Image106.png";
import Image106_2 from "../Product/Object_Image/Image106_2.png";
import Image107 from "../Product/Object_Image/Image107.png";
import Image107_2 from "../Product/Object_Image/Image107_2.png";
import Image108 from "../Product/Object_Image/Image108.png";
import Image108_2 from "../Product/Object_Image/Image108_2.png";
import Image109 from "../Product/Object_Image/Image109.png";
import Image109_2 from "../Product/Object_Image/Image109_2.png";

import Image201 from "../Product/Object_Image/Image201.png";
import Image201_2 from "../Product/Object_Image/Image201_2.png";
import Image202 from "../Product/Object_Image/Image202.png";
import Image202_2 from "../Product/Object_Image/Image202_2.png";
import Image203 from "../Product/Object_Image/Image203.png";
import Image204 from "../Product/Object_Image/Image204.png";
import Image204_2 from "../Product/Object_Image/Image204_2.png";
import Image205 from "../Product/Object_Image/Image205.png";
import Image205_2 from "../Product/Object_Image/Image205_2.png";
import Image206 from "../Product/Object_Image/Image206.png";
import Image206_2 from "../Product/Object_Image/Image206_2.png";
import Image207 from "../Product/Object_Image/Image207.png";
import Image207_2 from "../Product/Object_Image/Image207_2.png";
import Image208 from "../Product/Object_Image/Image208.png";
import Image208_2 from "../Product/Object_Image/Image208_2.png";
import Image209 from "../Product/Object_Image/Image209.png";
import Image209_2 from "../Product/Object_Image/Image209_2.png";

//jsdafhkjasdhfkjasdfh
import "./DetailPage.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import OrderPopupModal from "../../PopupModal/order_PopupModal";

function DetailPage() {
  const [count, setCount] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productName, setProductName] = useState("");
  const [inCart, setInCart] = useState(false);
  const rawUser = sessionStorage.getItem("user");
  const userId = rawUser ? JSON.parse(rawUser).id : null;
  const navigate = useNavigate();
  const [mainImageIndex, setMainImageIndex] = useState(0);

  //장바구니 팝업창
  const [showModal, setShowModal] = useState(false);

  const images = {
    1: [Image1],
    2: [Image2],
    3: [Image3],
    4: [Image4],
    5: [Image5],
    6: [Image6],
    7: [Image7],
    8: [Image8],
    9: [Image9],
    101: [Image101, Image101_2],
    102: [Image102, Image102_2],
    103: [Image103, Image103_2],
    104: [Image104, Image104_2],
    105: [Image105, Image105_2],
    106: [Image106, Image106_2],
    107: [Image107, Image107_2],
    108: [Image108, Image108_2],
    109: [Image109, Image109_2],
    201: [Image201, Image201_2],
    202: [Image202, Image202_2],
    203: [Image203],
    204: [Image204, Image204_2],
    205: [Image205, Image205_2],
    206: [Image206, Image206_2],
    207: [Image207, Image207_2],
    208: [Image208, Image208_2],
    209: [Image209, Image209_2],
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
    fetch("http://localhost:8080/cart/user_id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        quantity: count,
        price: productPrice,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`담기 실패:%{res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log("POST /cart 응답:", json); // { success: true } 여야 합니다
        setInCart(false);
      });
    // .catch(err => {
    //   console.error(err);
    //   alert(err.message);
    // });
  });

  // 장바구니 담기
  const toggleCart = () => {
    if (!userId) return alert("로그인 후 이용해주세요.");
    const url = "http://localhost:8080/cart";
    console.log(
      "▶️ toggleCart 호출, url:",
      url,
      "userId:",
      userId,
      "productId:",
      product.product_id
    );
    if (!inCart) {
      // 담기
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity: count,
          price: productPrice,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("장바구니 담기 실패");
          setInCart(false);
          setShowModal(true);
          // alert(
          //   `✅장바구니에 추가되었습니다! \n`+
          //   `품명: ${productName}\n`+
          //   `수량: ${count}개\n`+
          //   `가격: ${productPrice.toLocaleString()}원\n`+
          //   `===========================\n`+
          //   `합계: ${(count*productPrice).toLocaleString()}원`
          // );
        })
        .catch((err) => alert(err.message));
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const buyNow = () => {
    if (!userId) return alert("로그인 후 이용해주세요.");
    const orderData = {
      name: productName,
      quantity: count,
      price: product.price,
      product_id: productId,
    };
    // console.log("orderData:" + orderData.name);
    navigate("/order", { state: { items: [orderData] } });
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
      {showModal && (
        <OrderPopupModal
          productName={product.product_name}
          count={count}
          productPrice={product.price}
          closeModal={closeModal}
        />
      )}
      <div className="Product_Top">
        <div className="Product_Box">
          {/*이미지----------------------------------------------------------------------------*/}
          <div className="Product_Image">
            {product.product_id && images[product.product_id] ? (
              <img
                src={images[product.product_id][mainImageIndex]} // mainImageIndex를 사용하여 이미지 변경
                alt={product.product_name}
                style={{ width: "600px", height: "600px" }}
              />
            ) : (
              //----------------------------------------
              <span>이미지 없음</span>
            )}
          </div>
          {/*클릭시 이미지 변경-------------------------------------------------------------*/}
          <div className="Product_Scroll" style={{ cursor: "pointer" }}>
            {images[product.product_id]?.map((imgSrc, index) => (
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
            <button onClick={toggleCart}>
              {inCart ? "장바구니 빼기" : "장바구니 담기"}
            </button>
            <button onClick={() => buyNow(navigate)}>바로구매</button>
          </div>
        </div>
      </div>
      <div className="Product_DetailPage">
        <div className="Product_Coupon">
          <button
            style={{
              width: "1920px",
              fontSize: "20px",
            }}
          >
            첫 구매 시<br />
            99% 할인 쿠폰
          </button>
        </div>
        <div
          style={{
            fontSize: "40px",
            fontWeight: 600,
            marginTop: "120px",
            marginBottom: "80px",
            textAlign: "center",
          }}
        >
          {product.product_name} {/*상품이름*/}
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 400,
            marginBottom: "40px",
          }}
        >
          어디서도 볼 수 없는 특별한 디자인
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
        <div className="Product_Detail">{product.field1}</div> {/*상품설명*/}
        <div className="Product_Detail">{product.field2}</div>
        <div className="Product_Detail">{product.field3}</div>
        <br />
      </div>
    </>
  );
  return (
    <>
      <div className="Product_Top">
        <div className="Product_Box">
          {/*이미지----------------------------------------------------------------------------*/}
          <div className="Product_Image">
            {product.product_id && images[product.product_id] ? (
              <img
                src={images[product.product_id][mainImageIndex]} // mainImageIndex를 사용하여 이미지 변경
                alt={product.product_name}
                style={{
                  width: "600px",
                  height: "600px",
                  borderRadius: "30px",
                  objectFit: "cover",
                }}
              />
            ) : (
              //----------------------------------------
              <span>이미지 없음</span>
            )}
          </div>
          {/*클릭시 이미지 변경-------------------------------------------------------------*/}
          <div className="Product_Scroll" style={{ cursor: "pointer" }}>
            {images[product.product_id]?.map((imgSrc, index) => (
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
            <button onClick={toggleCart}>
              {inCart ? "장바구니 빼기" : "장바구니 담기"}
            </button>
            <button onClick={() => buyNow(navigate)}>바로구매</button>
          </div>
        </div>
      </div>
      <div className="Product_DetailPage">
        <div className="Product_Coupon">
          <button className="Product_Coupon_Button">
            첫 구매 시 99% 할인 쿠폰
          </button>
        </div>
        <div
          style={{
            fontSize: "80px",
            fontWeight: 400,
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          {product.product_name}
        </div>
        <div
          style={{ fontSize: "50px", fontWeight: 200, marginBottom: "80px" }}
        >
          어디서도 볼 수 없는 특별한 디자인
        </div>
        <div style={{ marginBottom: "40px" }}>
          {product.product_id &&
          images[product.product_id] &&
          images[product.product_id][0] ? (
            <img
              src={images[product.product_id][0]} // 배열의 첫 번째 이미지
              alt={product.product_name}
              style={{
                width: "900px",
                height: "900px",
                borderRadius: "30px",
                objectFit: "cover",
              }}
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
