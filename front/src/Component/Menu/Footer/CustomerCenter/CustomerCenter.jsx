import React from "react";
import "./CustomerCenter.css";
const CustomerCenter = () => {
  return (
    <main className="cc-Main">
      <div className="cc-All">
        <div className="cc-Text">
          {/*✅ 고객센터 */}
          <h2>고객 센터</h2>
        </div>
        <div className="cc-Box">
          <div className="cc-Box_QnA1">
            <h2>자주 묻는 질문</h2>
            <div className="cc-QnA1">
              <h3>Q. 1.배송은 얼마나 걸리나요?</h3>
              <p>A. 1. 일반적으로 결제일로부터 2~5일 이내에 도착합니다.</p>

              <h3>Q. 2. 주문 후 변경이나 취소가 가능한가요?</h3>
              <p>
                A. 2. 출고 전 상태라면 Q&A 또는 고객센터로 빠르게 요청해 주세요.
              </p>

              <h3>Q. 3. 상품이 불량이에요, 어떻게 해야 하나요?</h3>
              <p>
                A. 3. 수령 후 7일 이내 사진과 함께 고객센터로 접수해 주세요.
              </p>

              <h3>Q. 4. AS는 가능한가요?</h3>
              <p>
                A. 4. 단순 조립 제품 제외, 일부 품목에 한해 3개월 내 무상 A/S가
                가능합니다.
              </p>
            </div>
          </div>
          <div className="cc-Box_QnA2">
            <div>
              <h2>문 의</h2>
            </div>
            <div style={{ display: "flex", flexDirection: 'row' }}>
              <div className="cc-QnA2">
                <h3>전화 문의</h3>
                <p>031-1111-2222</p>
              </div>
              <div className="cc-QnA3">
                <h3>온라인문의</h3>
                <p style={{ position: 'relative' }}>문의 남기기
                <span style={{position: 'absolute',bottom: '-12px',left: '0',width: '100%',borderBottom: '2px solid black'}}></span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CustomerCenter;
