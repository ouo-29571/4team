import React, { useEffect, useState } from 'react'
import './History.css'
import { Link, useNavigate } from 'react-router-dom'

const History = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      alert("로그인 후 이용해주세요.");
      navigate('/', { replace: true });
      return;
    }
    const userId = JSON.parse(user).id;
    
    fetch('http://localhost:8080/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userId})
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errBody => {
            throw new Error(errBody.error || '구매내역 조회 실패');
          });
        }
        return res.json();
      })
      .then(data => {
        console.log("서버응답 데이터: ", data);
        const grouped = groupByOrder(data);
        setOrders(grouped);
      });
  }, []);

  const groupByOrder = (data) => {
    const map = {};
    data.forEach(item => {
      if (!map[item.order_id]) {
        map[item.order_id] = {
          order_id: item.order_id,
          order_date: item.order_date,
          delivery: item.delivery,
          items: [],
        };
      }
      map[item.order_id].items.push(item);
    });
    return Object.values(map);
  };

  return (
    <>
      <h2>구매내역</h2>
      <div className="card-container">
        {orders.length === 0 ? (
          <p className="no-orders">아직 주문내역이 없습니다.</p>
        ) : (
          orders.map(order => (
            <div key={order.order_id} className="order-card">
              {/* 카드 상단 */}
              <div className="card-header">
                <div className="left-header">
                  <div className="order-line">
                    <span className="label">🛒 주문일자: </span> {order.order_date.substring(0, 10)}
                  </div>
                  <div className="order-line">
                    <span className="label">🚚 배송상태: </span> {order.delivery}
                  </div>
                </div>
                <div className="right-header">
                  <Link to={`/order-detail/${order.order_id}`} className="detail-link">
                    주문상세보기 ▶
                  </Link>
                </div>
              </div>

              {/* 카드 본문 */}
              <div className="card-body">
                {order.items.map((item, idx) => (
                  <div key={idx} className="product-info">
                    <img src={item.image_url || '#'} alt="상품이미지" className="product-img" />
                    <div className="product-details">
                      <p className="product-name">{item.product_name}</p>
                      <p className="product-name">수량: {item.quantity}</p>
                      <p className="product-name">금액: {item.price}원</p>
                      {item.estimated_date && <p className="product-name">{item.estimated_date?.substring(0, 10)} 도착 예정</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* 카드 하단 */}
              <div className="card-footer">
                <div className="card-buttons">
                  <button onClick={() => navigate(`/delivery/${order.order_id}`)}>배송조회</button>
                  <button onClick={() => navigate(`/exchange/${order.order_id}`)}>교환/반품</button>
                  <button onClick={() => navigate(`/review/${order.order_id}`)}>리뷰작성</button>
                </div>
              </div>
            </div>
          )))}
      </div>
    </>

  );
};

export default History