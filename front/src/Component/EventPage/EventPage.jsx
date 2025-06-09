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
        <h3>최대 50% 할인 <br />
            쿠폰 받기
        </h3>
        <div className="cp-items"> 
          <div className="item-box">1</div>
          <div className="item-box">2</div>
          <div className="item-box">3</div>
        </div>

        <button onClick={() => alert("쿠폰이 발급되었습니다!")}>
        쿠폰 받기 클릭
        </button> 
      </section>

      {/* 출석체크하고 할인 받기 */}
      <section className="attendance-section">
        <h3>출석체크하고 할인 받기</h3>
        <div className="date">6/1 ~ 6/30</div>
        <button onClick={() => alert("출석 체크 완료되었습니다!")}>출첵 클릭</button>
      </section>

          {/* 할인 추천 상품 */}
      <section className="discount-section">
        <div className='dc-title'><p> 할인 쿠폰에 포인트까지 </p></div>
        <h3 className='dc-h3'>할인 추천 상품</h3>
        <div className="dc-items"> 
          <div className="item-box">1</div>
          <div className="item-box">2</div>
          <div className="item-box">3</div>
        </div>
      </section>
    </div>

  )
}

export default EventPage;
