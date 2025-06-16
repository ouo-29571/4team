import { useLocation, useNavigate } from "react-router-dom";
import "./Order.css";
import { usePostcode } from "./usePostcode";
import { useEffect, useState } from "react";

function Order() {
  const location = useLocation();
  const orderItems = location.state?.items || [];
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalPrice: 0,
    discount: 0,
    delivery: 0,
    finalPrice: 0,
  });

  // 할인쿠폰 불러오기
  useEffect(() => {
    const rawUser = sessionStorage.getItem("user");
    if (!rawUser) return;

    const { id: userId } = JSON.parse(rawUser);

    fetch(`http://localhost:8080/users/${userId}/coupons`)
      .then((res) => res.json())
      .then(setDiscounts)
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!orderItems || orderItems.length === 0) return;

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const selected = discounts.find((d) => d.discount_id === selectedDiscount);

    let discountAmount = 0;
    if (selected) {
      if (selected.discount_type === "percent") {
        discountAmount = Math.floor(totalPrice * (selected.discount / 100));
      } else {
        discountAmount = selected.discount;
      }
    }
    const delivery = totalPrice === 0 ? 0 : totalPrice < 30000 ? 3000 : 0;
    const finalPrice = totalPrice - discountAmount + delivery;

    setSummary({
      totalPrice,
      discount: discountAmount,
      delivery,
      finalPrice,
    });
  }, [orderItems, selectedDiscount, discounts]);

  const { wrapRef, wrapVisible, handlePostcode, handleClose } = usePostcode();

  const handleOrder = () => {
    const rawUser = sessionStorage.getItem("user");
    if (!rawUser) {
      return alert("로그인 후 이용해주세요.");
    }
    const user = JSON.parse(rawUser);
    const paymentSelect = document.getElementById("paymentSelect");
    const selectedPaymentText =
      paymentSelect?.selectedOptions[0]?.text || "미선택";
    const confirmMsg = `
      배송지: ${document.getElementById("sample3_address")?.value || "없음"}
      상세주소: ${
        document.getElementById("sample3_detailAddress")?.value || "없음"
      }
      결제수단: ${selectedPaymentText}
      총 금액: ${summary.finalPrice}원
      주문하시겠습니까?
    `;
    if (!window.confirm(confirmMsg)) return;

    const orderData = {
      address: document.getElementById("sample3_address")?.value,
      detailAddress: document.getElementById("sample3_detailAddress")?.value,
      payment: document.getElementById("paymentSelect").value,
      discount_id: selectedDiscount,
      total_price: summary.finalPrice,
      user_id: user.id,
      items: orderItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    console.log(orderData);

    fetch("http://localhost:8080/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...orderData,
        discount_id: selectedDiscount === 0 ? null : selectedDiscount,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("주문 실패");
        return res.text();
      })
      .then(() => {
        alert("주문이 완료되었습니다.");
        navigate("/history");
      })
      .catch((err) => alert("주문 처리 중 오류: " + err.message));
  };

  return (
    <>
      <div className="Order-Main">
        <h2>결제하기</h2>

        {/* 주소찾기 */}
        <div className="order-form">
          <p>배송지입력</p>
          <div className="order-item-box">
            <div className="row">
              <input className="row-input"
                type="text"
                id="sample3_postcode"
                placeholder="우편번호"
                disabled
                style={{ height: "37px" }}
              />
              <button className="ZipCode" onClick={handlePostcode}>
                우편번호 찾기
              </button>
            </div>
            <input 
              type="text"
              id="sample3_address"
              placeholder="주소"
              className="row-input"
              disabled
            />
            <input
              type="text"
              id="sample3_detailAddress"
              placeholder="상세주소"
              className="row-input"
            />

            {wrapVisible && (
              <>
                <div ref={wrapRef} id="wrap" className="postcode-embed" />
                <button className="postcode-close-btn" onClick={handleClose}>
                  ×
                </button>
              </>
            )}
          </div>
        </div>

        {/* 상품정보 */}
        <div className="order-form">
          <p>주문상품</p>
          {orderItems.map((item, index) => (
            <div key={index} className="order-item-box">
              <div className="item-row">
                <label>상품명</label>
                <input value={item.name} className="item-box-input" disabled />
              </div>
              <div className="item-row">
                <label>수량</label>
                <input
                  value={`${item.quantity}EX`}
                  className="item-box-input"
                  disabled
                />
              </div>
              <div className="item-row">
                <label>총 금액</label>
                <input
                  value={(item.price * item.quantity).toLocaleString() + "원"}
                  className="item-box-input"
                  disabled
                />
              </div>
            </div>
          ))}
        </div>

        {/* 할인/쿠폰 */}
        <div className="order-form">
          <p>할인/쿠폰</p>
          <div className="order-item-box">
            <select
              className="full-input"
              value={selectedDiscount}
              onChange={(e) => setSelectedDiscount(Number(e.target.value))}
            >
              <option value={0}>쿠폰 선택 안 함</option>
              {discounts.map((discount) => (
                <option key={discount.discount_id} value={discount.discount_id}>
                  {discount.name} (-
                  {discount.discount}
                  {discount.discount_type === "percent" ? "%" : "원"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 결제수단 */}
        <div className="order-form">
          <p>결제수단</p>
          <div className="order-item-box">
            <select id="paymentSelect" className="full-input" defaultValue="">
              <option value="" disabled>
                결제수단 선택
              </option>
              <option value="card">카드</option>
              <option value="simple-order">간편결제</option>
              <option value="deposit">무통장입금</option>
            </select>
          </div>
        </div>

        {/* 결제상세 */}
        <div className="order-form-sticky">
          <p>결제상세</p>
          <div className="order-item-box">
            <div className="item-row">
              <label>구매금액</label>
              <input
                value={summary.totalPrice.toLocaleString() + '원'}
                disabled
                className="item-box-input"
              />
            </div>
            <div className="item-row">
              <label>할인금액</label>
              <input
                value={summary.discount.toLocaleString() + '원'}
                disabled
                className="item-box-input"
              />
            </div>
            <div className="item-row">
              <label>배송비</label>
              <input
                value={summary.delivery.toLocaleString() + '원'}
                disabled
                className="item-box-input"
              />
            </div>
            <br />
            <div className="item-row">
              <label style={{ fontWeight: "bold" }}>총 결제금액</label>
              <input
                value={summary.finalPrice.toLocaleString() + '원'}
                disabled
                className="item-box-input"
              />
            </div>
            <button className="ItemBuy-button"
             onClick={handleOrder}>
              구매하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;
