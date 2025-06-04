import "./DetailPage.css";
import Footer from "../Footer/Footer";

function DetailPage() {

  return (
    <>
      <div className="Product_Top">
        <div className="Product_Box">
          <div className="Product_Image">사진</div>
          <div className="Product_Scroll">
            <button className="Thumb_Button">{"<="}</button>
            <div className="Thumb">시</div>
            <div className="Thumb">바</div>
            <div className="Thumb">거</div>
            <button className="Thumb_Button">{"=>"}</button>
          </div>
        </div>
        <div className="Product_Info">
          <div className="Product_Name">상품명</div>
          <div className="Product_Price-Box">
            <div className="Product_Price">가격</div>
            <div className="Product_Quantity">
              수량
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
          </div>
          <div className="Product_Buttons">
            <button>찜</button>
            <button>장바구니</button>
            <button>바로구매</button>
          </div>
        </div>
      </div>
      <div>
        <div className="Product_Detail">상세내용</div>
      </div>
      <Footer />
    </>
  );
}

export default DetailPage;
