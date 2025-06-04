import "./DetailPage.css";
import { useState } from "react";

function DetailPage() {
  const [count, setCount] = useState(1);

  return (
    <>
      <div className="Product_Top">
        <div className="Product_Box">
          <div className="Product_Image">DB사진</div>
          <div className="Product_Scroll">
            <button className="Thumb_Button">{"<="}</button>
            <div className="Thumb">DB사</div>
            <div className="Thumb">DB진</div>
            <div className="Thumb">DB첩</div>
            <button className="Thumb_Button">{"=>"}</button>
          </div>
        </div>
        <div className="Product_Info">
          <div className="Product_Name">DB상품명</div>
          <div className="Product_Price-Box">
            <div className="Product_Price">
              <span>가격</span>
              <span>DB 가격
              </span>
            </div>
            <div className="Product_Quantity">
              수량
              <div className="Product_Quantity_buttons">
                <button onClick={() => setCount(Math.max(count - 1, 0))}>
                  -
                </button>
                <span>{count}</span>
                <button onClick={() => setCount(count + 1)}>+</button>
              </div>
            </div>
          </div>
          <div className="Product_Buttons">
            <button>찜</button>
            <button>장바구니</button>
            <button>바로구매</button>
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
