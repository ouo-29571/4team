// src/components/cart/Cart.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    totalPrice: 0, 
    discount: 0, 
    delivery: 0,
    finalPrice: 0
  });

  const allCheck = (checked) => {
    setCartItems(prev => prev.map(item => ({ ...item, checked })));
  };

    // 체크박스 토글 (개별 선택)
  const toggleCheck = (index) => {
    setCartItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // 선택 삭제
  const selected_Delete = () => {
    const toDelete = cartItems.filter(item => item.checked).map(item => item.id)
      fetch(`http://localhost:8080/cart/delete-multiple`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ ids: toDelete })
      })
        .then(() => {
          return fetch('http://localhost:8080/cart');
        })
        .then(res => res.json())
        .then(data => {
          const withChecked = data.cart.map(item => ({ ...item, checked: false }));
          setCartItems(withChecked);
          setSummary(data.summary);
    })
    .catch(err => console.error('선택 삭제 실패:', err));
  };

  // 개별 삭제 버튼 (id 기준 삭제)
  const del_btn = (id) => {
    fetch(`http://localhost:8080/cart/${id}`,{
      method: 'DELETE'
    })
    .then(() => {
      setCartItems(prev => prev.filter(item => item.id !== id));
    })
    .catch(err => console.error('개별 삭제 실패:', err));
  };

  const placeOrder = (navigate) => {
    const orderItems = cartItems.filter(item => item.checked);
    if (orderItems.length === 0) return alert("주문할 항목을 선택하세요!");

    navigate('/order', {state: {items: orderItems } });
  };


  

  // "전체 선택" 체크박스 상태 계산
  const isAllChecked =
    cartItems.length > 0 && cartItems.every((item) => item.checked)

  // 1) 컴포넌트 마운트 시 한 번만, 서버에서 장바구니 데이터를 가져와서
  //    cartItems 상태에 저장 (checked 필드를 false로 초기화)
  useEffect(() => {
    fetch('http://localhost:8080/cart',{
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        // 서버에서 받아온 data.cart 배열에 각 item마다 checked: false 추가
        const withChecked = data.cart.map((item) => ({
          ...item,
          checked: false,
          product_id: item.product_id, // 필요하다면 추가
        }))
        setCartItems(withChecked)
      })
      .catch((err) => {
        console.error('장바구니 데이터 로딩 실패:', err)
      })
  }, [setCartItems])

  // 2) cartItems가 바뀔 때마다, 선택된(checked) 아이템들의 합산/할인/배송/총액을 계산해서 summary 상태에 반영
  useEffect(() => {
    const checkedItems = cartItems.filter((item) => item.checked)

    // 총 상품가격 = 각 아이템 가격 * 수량의 합
    const totalPrice = checkedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // discount, delivery: 아이템이 하나라도 선택되어 있으면 3000원
    const discount = checkedItems.length > 0 ? 3000 : 0
    const delivery = checkedItems.length > 0 ? 3000 : 0

    // 최종 결제금액 = 총 상품가격 - 할인 + 배송비
    const finalPrice = totalPrice - discount + delivery

    setSummary({ totalPrice, discount, delivery, finalPrice })
  }, [cartItems, setSummary])

  return (
    <>
      <div>
        <h2>장바구니</h2>
      </div>
      <main>
        <section>
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
                style={{ marginLeft: 'auto' }}
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
                  <img src="#" alt="상품 이미지" />
                </div>
              </div>
              <div className="centerBox">
                <br />
                <input
                  value={item.name}
                  className="full-input"
                  placeholder="상품명"
                  readOnly
                />
                <input
                  value={item.quantity || ''}
                  className="full-input"
                  placeholder="수량"
                  readOnly
                />
                <input
                  value={item.price || ''}
                  className="full-input"
                  placeholder="금액"
                  readOnly
                />
              </div>
              <div className="rightBox">
                <button onClick={() => del_btn(item.id)}>삭제</button>
              </div>
            </div>
          ))}

          {/* 구매 예상 금액 영역 */}
          <div className="purchaseBox">
            <h4>주문 예상 금액</h4>
            <form>
              <p>총 상품가격</p>
              <input
                value={summary.totalPrice}
                type="text"
                className="small-input"
                readOnly
              />
              <p>+ 총 할인</p>
              <input
                value={summary.discount}
                type="text"
                className="small-input"
                readOnly
              />
              <p>+ 총 배송비</p>
              <input
                value={summary.delivery}
                type="text"
                className="small-input"
                readOnly
              />
            </form>
            <br />
            <input
              value={summary.finalPrice}
              placeholder="총 금액"
              className="full-input"
              readOnly
            />
            <br />
            <button
              onClick={() => placeOrder(navigate)}
              style={{ width: '800px' }}
            >
              구매하기
            </button>
          </div>
        </section>
      </main>
      <footer></footer>
    </>
  )
}

export default Cart