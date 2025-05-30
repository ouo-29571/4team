import React from 'react'

const Footer = () => {
  return (
    <div>
       <div className="footer_BigBox">
                    <div className="footer_BigBox_2">
                        <div className="footer_BigBox_left">
                            <h1>logo</h1>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        ></div>
                        <div className="footer_BigBox_right">
                            <button className="footer_BigBox_right_button">고객센터</button>
                            <button className="footer_BigBox_right_button">아용약관</button>
                            <button className="footer_BigBox_right_button">오시는길</button>
                        </div>
                    </div>

                    <div className="footer_BigBox_right_inner_center">
                        <h4>회사명명 글로벌 아카데미</h4>
                        <h4>대표자 홍길동</h4>
                        <h4>
                            주소 : 도로명 주소: 경기도 화성시 떡전골로 97 , 지번 주소: 경기도
                            화성시 병점동 527
                        </h4>
                        <h4>이메일 : HongGil-dong@gmail.com</h4>
                        <h4>개인정보보호책임자 : 홍길동</h4>
                        <h4>
                            채무지급보증 안내 :당사는 고객님이 현금 결제한 금액에 대해
                            채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다.
                        </h4>
                    </div>
                </div>

                <button
                    className="goTopButton"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    ⬆️
                </button>
                <button
                    className="godownButton"
                    onClick={() => window.scrollTo({ top: 4000, behavior: "smooth" })}
                >
                    ⬇️
                </button>
    </div>
  )
}

export default Footer
