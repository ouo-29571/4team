import '../EventPage/EventPage.css'

const EventPage = () => {
  return (
    <div className="eventpage-bigbox">
      {/* 썸머 페스타 */}
    <section className="vintage-section">
  <div className="vt-wrapper">
    <div className="vt-textbox">
      <div className="vt-text">
        <h2>vintage haus <br /> 썸머 페스타</h2> 
        <h3>6/1 ~ 6/30</h3>
        <p>여름 맞이 빅 세일 프로모션, 빈티지 하우스에서 만나보세요.</p>
        <h6>
          event 1. 최대 50% 할인 쿠폰 지급 <br />
          event 2. 출석체크 시 포인트 지급 <br />
          event 3. 첫 구매시 99% 할인
        </h6>
      </div>
    </div>
    <div className="vt-imgbox"></div>
  </div>
</section>


      {/* 최대 50% 할인 쿠폰 받기 */}
      <section className="coupon-section">

        <p className="cp-banner">할인 쿠폰에 포인트까지!</p>

        <div className="cp-title">
        <h3>최대 50% 할인 <br />
            쿠폰 받기
        </h3>
        </div>

        <div className="cp-items"> 
          <div className="item-box">
            <img className="item-img1" src="/img/쿠폰-가구.png"></img>
          </div>
          <div className="item-box">
            <img className="item-img1" src="/img/쿠폰-인테리어.png"></img>
          </div>
          <div className="item-box">
            <img className="item-img1" src="/img/쿠폰-주방.png"></img>
          </div>

          <div className="cpbtn-wrapper">
          <button className="cp-button" onClick={() => alert("쿠폰이 발급되었습니다!")}>
          쿠폰 한 번에 받기
          </button>
          </div>

        </div>

       
      </section>

      {/* 출석체크하고 할인 받기 */}
      <section className="attendance-section">

        <h3 className="at-title">
          출석체크하고 <br/>
          할인 받기</h3>
        <div className="at-date">6/1 ~ 6/30</div>


        <div className="at-boxline">

          <div className="at-textbox">
          <span className="at-text">
            매일매일 500p 적립</span>
          </div>

          <div className="at-daybox"> 
            <div className="at-day">1</div>
            <div className="at-day">2</div>
            <div className="at-day">3</div>
          </div>
          
        </div>


        <button onClick={() => alert("출석 체크 완료되었습니다!")}>오늘 출석 체크 하기</button>
      </section>

          {/* 할인 추천 상품 */}
      <section className="discount-section">
    
        <h3 className='dc-h3'>할인 추천 상품</h3>
        <div className="dc-items"> 
          <div className="item-box">가구</div>
          <div className="item-box">주방용품</div>
          <div className="item-box">인테리어 오브제</div>
        </div>
      </section>
    </div>

  )
}

export default EventPage;
