import React, { useEffect, useState } from "react";
import "./History.css";
import { Link, useNavigate } from "react-router-dom";
import OrderDetailModal from "../PopupModal/OrderDetailModal/OrderDetailModal";
import images from "../Menu/Product/productimg";

function getTimeLeft(estimatedDateStr) {
    if (!estimatedDateStr) return null;
    const now = new Date();
    const estimated = new Date(estimatedDateStr);
    const diff = estimated - now;
    if (diff <= 0) return null;
    return Math.floor(diff / 60000);
}
const History = () => {
    const [orders, setOrders] = useState([]);
    const [modalOrder, setModalOrder] = useState(null);
    const [timeLefts, setTimeLefts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (!user) {
            alert("로그인 후 이용해주세요.");
            navigate("/", { replace: true });
            return;
        }
        const userId = JSON.parse(user).id;

        fetch("http://localhost:8080/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((errBody) => {
                        throw new Error(errBody.error || "구매내역 조회 실패");
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log("서버응답 데이터: ", data);
                const grouped = groupByOrder(data);
                setOrders(grouped);
            });
    }, []);

    const groupByOrder = (data) => {
        const map = {};
        data.forEach((item) => {
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

    // 실시간 남은분 업데이트
    useEffect(() => {
        if (!orders.length) return;
        const updateTimes = () => {
            const allTimes = {};
            orders.forEach((order) => {
                order.items.forEach((item, idx) => {
                    if (item.estimated_date && item.delivery !== "배송완료") {
                        if (!allTimes[order.order_id])
                            allTimes[order.order_id] = {};
                        const mins = getTimeLeft(item.estimated_date);
                        allTimes[order.order_id][idx] = mins;
                    }
                });
            });
            setTimeLefts(allTimes);
        };
        updateTimes();
        const timer = setInterval(updateTimes, 60000); // 1분마다
        return () => clearInterval(timer);
    }, [orders]);

    return (
        <>
            <div className="historybox">
                <h2>구매내역</h2>
                <div className="card-container">
                    {orders.length === 0 ? (
                        <p className="no-orders">아직 주문내역이 없습니다.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order.order_id} className="order-card">
                                {/* 카드 상단 */}
                                <div className="card-header">
                                    <div className="left-header">
                                        <div className="order-line">
                                            <span className="label">
                                                🛒 주문일자:{" "}
                                            </span>{" "}
                                            {order.order_date.substring(0, 10)}
                                        </div>
                                        <div className="order-line">
                                            <span className="label">
                                                🚚 배송상태:{" "}
                                            </span>{" "}
                                            {order.delivery}
                                        </div>
                                    </div>
                                    <div className="right-header">
                                        <button
                                            className="detail-link"
                                            onClick={() => setModalOrder(order)}
                                        >
                                            주문상세보기 ▶
                                        </button>
                                    </div>
                                </div>

                                {/* 카드 본문 */}
                                <div className="card-body">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="product-info">
                                            <img
                                                src={images[item.product_id]}
                                                alt="상품이미지"
                                                className="product-img"
                                            />
                                            <div className="product-details">
                                                <p className="product-name">
                                                    {item.product_name}
                                                </p>
                                                <p className="product-name">
                                                    수량: {item.quantity}
                                                </p>
                                                <p className="product-name">
                                                    금액: {item.price}원
                                                </p>
                                                {item.estimated_date && (
                                                    <p className="product-name">
                                                        {item.estimated_date.substring(
                                                            0,
                                                            16
                                                        )}{" "}
                                                        도착 예정
                                                        {item.delivery !==
                                                            "배송완료" &&
                                                            (timeLefts[
                                                                order.order_id
                                                            ]?.[idx] != null &&
                                                            timeLefts[
                                                                order.order_id
                                                            ][idx] > 0 ? (
                                                                <span
                                                                    style={{
                                                                        marginLeft:
                                                                            "8px",
                                                                        color: "#ff9800",
                                                                    }}
                                                                >
                                                                    (
                                                                    {
                                                                        timeLefts[
                                                                            order
                                                                                .order_id
                                                                        ][idx]
                                                                    }
                                                                    분 남음)
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        marginLeft:
                                                                            "8px",
                                                                        color: "#2196f3",
                                                                    }}
                                                                >
                                                                    (곧 도착
                                                                    예정!)
                                                                </span>
                                                            ))}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="card-buttons">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/delivery/${order.order_id}`
                                                        )
                                                    }
                                                >
                                                    배송조회
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/exchange/${order.order_id}`
                                                        )
                                                    }
                                                >
                                                    교환/반품
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/review/${order.order_id}`
                                                        )
                                                    }
                                                >
                                                    리뷰작성
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {modalOrder && (
                <OrderDetailModal
                    order={modalOrder}
                    onClose={() => setModalOrder(null)}
                />
            )}
        </>
    );
};

export default History;
