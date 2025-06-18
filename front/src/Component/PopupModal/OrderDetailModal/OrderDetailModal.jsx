import React from "react";
import "./OrderDetailModal.css";

const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

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
                                <span className="detail-label">배송 예정:</span>
                                {item.estimated_date?.substring(0, 10)}
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
