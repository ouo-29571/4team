// src/components/cart/Cart.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import images from "../Menu/Product/productimg.jsx";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    totalPrice: 0,
    discount: 0,
    delivery: 0,
    finalPrice: 0,
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      alert("로그인 후 이용해주세요.");
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);

  const allCheck = (checked) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, checked })));
  };

  // 체크박스 토글 (개별 선택)
  const toggleCheck = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // 선택 삭제
  const selected_Delete = async () => {
    const sessionUser = sessionStorage.getItem("user");
    const user = JSON.parse(sessionUser);

    const toDelete = cartItems
      .filter((item) => item.checked)
      .map((item) => item.id);

    // 1) 삭제 요청
    const deleteRes = await fetch(
      "http://localhost:8080/cart/delete-multiple",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: toDelete }),
      }
    );
    if (!deleteRes.ok) throw new Error(`삭제 실패: ${deleteRes.status}`);

    // 2) 삭제 후 장바구니 다시 불러오기
    fetch("http://localhost:8080/personalCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 서버에서 받아온 data.cart 배열에 각 item마다 checked: false 추가
        const withChecked = data.cart.map((item) => ({
          ...item,
          checked: false,
          product_id: item.product_id, // 필요하다면 추가
        }));
        setCartItems(withChecked);
      })
      .catch((err) => {
        console.error("장바구니 데이터 로딩 실패:", err);
      });
    // 3) 상태 업데이트
    // const withChecked = data.cart.map(item => ({ ...item, checked: false }));
    // setCartItems(withChecked);
    // setSummary(data.summary);
  };

  // 개별 삭제 버튼 (id 기준 삭제)
  const del_btn = (id) => {
    fetch(`http://localhost:8080/cart/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => console.error("개별 삭제 실패:", err));
  };

  const placeOrder = (navigate) => {
    const orderItems = cartItems.filter((item) => item.checked);
    if (orderItems.length === 0) return alert("주문할 항목을 선택하세요!");

    navigate("/order", { state: { items: orderItems } });
  };

  // "전체 선택" 체크박스 상태 계산
  const isAllChecked =
    cartItems.length > 0 && cartItems.every((item) => item.checked);

  // 1) 컴포넌트 마운트 시 한 번만, 서버에서 장바구니 데이터를 가져와서
  //    cartItems 상태에 저장 (checked 필드를 false로 초기화)
  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    const user = JSON.parse(sessionUser);
    console.log(user.id);
    fetch("http://localhost:8080/personalCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 서버에서 받아온 data.cart 배열에 각 item마다 checked: false 추가
        const withChecked = data.cart.map((item) => ({
          ...item,
          checked: false,
          product_id: item.product_id, // 필요하다면 추가
        }));
        setCartItems(withChecked);
      })
      .catch((err) => {
        console.error("장바구니 데이터 로딩 실패:", err);
      });
  }, [setCartItems]);

  // 2) cartItems가 바뀔 때마다, 선택된(checked) 아이템들의 합산/할인/배송/총액을 계산해서 summary 상태에 반영
  useEffect(() => {
    const checkedItems = cartItems.filter((item) => item.checked);

    // 총 상품가격 = 각 아이템 가격 * 수량의 합
    const totalPrice = checkedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 총 수량
    const totalQuantity = checkedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // 3만원이상시 배송비 무료
    const delivery = totalPrice === 0 ? 0 : totalPrice < 30000 ? 3000 : 0;

    // 최종 결제금액 = 총 상품가격 - 할인 + 배송비
    const finalPrice = totalPrice + delivery;

    setSummary({ totalPrice, totalQuantity, delivery, finalPrice });
  }, [cartItems, setSummary]);

  return (
    <>
      <main className="cart-Main">
        <section>
          <div className="cart">
            <h2>장바구니</h2>
          </div>
          {/* 상단: 전체선택 + 선택삭제 */}
          <div className="choiceBox">
            <form>
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={(e) => allCheck(e.target.checked)}
              />
              <p>전체선택</p>
              <button
                type="button"
                onClick={selected_Delete}
                className="TotalDel_btn"
                style={{ marginLeft: "auto" }}
              >
                선택삭제
              </button>
            </form>
          </div>

          {/* 장바구니 목록 */}
          {cartItems.map((item, index) => (
            <div key={item.id ?? index} className="cartList">
              <div className="leftBox">
                <form>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(index)}
                  />
                </form>
                <div className="imgBox">
                  <img
                    src={images[item.product_id]}
                    alt={item.product_name}
                    height="50"
                    width="50"
                  />
                </div>
              </div>
              <div className="centerBox">
                <br />
                <input
                  value={item.name}
                  className="	Product-input"
                  placeholder="상품명"
                  disabled
                />

                <input
                  value={`${item.quantity || ""}EX`}
                  className="Quantity-input"
                  placeholder="수량"
                  disabled
                />

                <input
                  value={
                    item.price
                      ? Number(item.price).toLocaleString() + " 원" // 🔴 천 단위 콤마 찍기
                      : ""
                  }
                  className="Amount-input"
                  placeholder="금액"
                  disabled
                />
              </div>
              <div className="rightBox">
                <button className="del_btn" onClick={() => del_btn(item.id)}>
                  삭제
                </button>
              </div>
            </div>
          ))}

          {/* 구매 예상 금액 영역 */}
          <div className="purchaseBox">
            <h4>주문 예상 금액</h4>
            <form>
              <p>총 상품가격</p>
              <input
                value={
                  summary.totalPrice
                    ? Number(summary.totalPrice).toLocaleString() + " 원" // 🔴 콤마와 원 표시 추가
                    : ""
                }
                type="text"
                className="small-input"
                disabled
              />

              <p>+ 배송비(3만원이상 구매시 배송비 무료)</p>
              <input
                value={summary.delivery}
                type="text"
                className="small-input"
                disabled
              />
            </form>
            <br />
            <br />
            <div className="confirmBox">
              <p>구매물품 수량</p>
              <input
                value={`${summary.totalQuantity}EX`}
                disabled
                style={{ margin: "0px 10px" }}
                className="small-input"
              />
              <p>예상 결제금액</p>
              <input
                value={
                  summary.finalPrice
                    ? Number(summary.finalPrice).toLocaleString() + " 원" // 🔴 콤마 추가
                    : ""
                }
                placeholder="총 금액"
                style={{ marginLeft: "10px" }}
                className="small-input"
                disabled
              />
            </div>
            <div>
              <button
                className="Buy-button"
                onClick={() => placeOrder(navigate)}
              >
                구매하기
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer></footer>
    </>
  );
}

export default Cart;
