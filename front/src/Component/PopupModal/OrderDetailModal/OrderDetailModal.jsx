import React, { useEffect, useState } from "react";
import "./OrderDetailModal.css";

function getTimeLeft(estimatedDateStr) {
    if (!estimatedDateStr) return null;
    const now = new Date();
    const estimated = new Date(estimatedDateStr);
    const diff = estimated - now;
    if (diff <= 0) return null;
    return Math.floor(diff / 60000);
}

const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const [timeLefts, setTimeLefts] = useState({});

    useEffect(() => {
        const updateTimes = () => {
            const times = {};
            order.items.forEach((item, idx) => {
                if (item.estimated_date && item.delivery !== "배송완료") {
                    const mins = getTimeLeft(item.estimated_date);
                    times[idx] = mins;
                }
            });
            setTimeLefts(times);
        };
        updateTimes();
        const timer = setInterval(updateTimes, 60000);
        return () => clearInterval(timer);
    }, [order]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    X
                </button>

                {/* 주문상세 박스 */}
                <h4>주문상세</h4>
                <div className="detail-title-box">
                    <div className="product-info-row">
                        <span className="detail-label">주문번호:</span>{" "}
                        {order.order_id}
                    </div>
                    <div className="product-info-row">
                        <span className="detail-label">주문일자:</span>{" "}
                        {order.order_date?.substring(0, 10)}
                    </div>
                    <div className="product-info-row">
                        <span className="detail-label">배송상태:</span>{" "}
                        {order.delivery}
                    </div>
                </div>

                <div className="product-list">
                    <div className="product-info-title">상품 목록</div>
                    {order.items.map((item, idx) => (
                        <div key={idx} className="product-item">
                            <div className="product-info-row">
                                <span className="detail-label">상품명:</span>{" "}
                                {item.product_name}
                            </div>
                            <div className="product-info-row amont-row">
                                <div>
                                    <span className="detail-label">수량:</span>{" "}
                                    {item.quantity}개
                                </div>
                                <div>
                                    <span className="detail-label">금액:</span>
                                    {item.price.toLocaleString()}원
                                </div>
                            </div>
                            <div className="product-info-row">
                                도착예정:{" "}
                                {item.estimated_date?.substring(0, 16)}
                                {item.delivery !== "배송완료" &&
                                    item.estimated_date &&
                                    (timeLefts[idx] != null &&
                                    timeLefts[idx] > 0 ? (
                                        <span
                                            style={{
                                                marginLeft: "8px",
                                                color: "#ff9800",
                                            }}
                                        >
                                            ({timeLefts[idx]}분 남음)
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                marginLeft: "8px",
                                                color: "#2196f3",
                                            }}
                                        >
                                            (곧 도착 예정!)
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 총 결제금액 박스 */}
                <div className="total-price-box">
                    총 결제금액: {total.toLocaleString()}원
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
