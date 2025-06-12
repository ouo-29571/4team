import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="footer_BigBox">
                <div className="footer_BigBox_2">
                    <img
                        src="/img/logo1.png"
                        alt="logo"
                        style={{ width: "70px", height: "70px" }}
                    />
                    <div className="Logo">
                        <h1>vintage haus</h1>
                    </div>
                    <div className="footer_BigBox_right">
                        <button
                            onClick={() => navigate("/CustomerCenter")}
                            className="footer_BigBox_right_button"
                        >
                            고객센터
                        </button>
                        <button className="footer_BigBox_right_button">
                            이용약관
                        </button>
                        <button className="footer_BigBox_right_button">
                            오시는길
                        </button>
                    </div>
                </div>

                <div className="footer_BigBox_right_inner_center">
                    <h4>회사명 : vintage haus (주)</h4>
                    <h4>대표자 : 홍길동</h4>
                    <h4>
                        주 소 : 도로명 주소: 경기도 화성시 떡전골로 97 , 지번
                        주소: 경기도 화성시 병점동 527
                    </h4>
                    <h4>이메일 : HongGil-dong@gmail.com</h4>
                    <h4 style={{ marginBottom: "120px" }}>
                        개인정보보호책임자 : 홍길동
                    </h4>
                    <div
                        style={{
                            paddingTop: "20px",
                            borderTop: "1px solid white",
                            width: "95%",
                        }}
                    >
                        <h4>
                            채무지급보증 안내 :당사는 고객님이 현금 결제한
                            금액에 대해 채무지급보증 계약을 체결하여 안전거래를
                            보장하고 있습니다.
                        </h4>
                    </div>
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
                onClick={() =>
                    window.scrollTo({ top: 6000, behavior: "smooth" })
                }
            >
                ⬇️
            </button>
        </div>
    );
};

export default Footer;
