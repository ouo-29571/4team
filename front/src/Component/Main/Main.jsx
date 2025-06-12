import { useState } from "react";
import "./Main.css";
import MainSlider from "../MainSlider/MainSlider";
import "../MainSlider/MainSlider.css";
import ScrollbarDs from "../ScrollbarDs/ScrollbarDs";
import MarqueeText from "../MarqueeText/MarqueeText";
import PopupModal from "../PopupModal/PopupModal";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider/ImageSlider";
import { Link } from "react-router-dom";
//삭제용 test

function Main() {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [selected, setSelected] = useState("1");
    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    return (
        <div className="bigbox">
            <PopupModal />

            <div>
                <MainSlider /> {/* ✅ 메인*/}
            </div>
            {/* <div className="main-clickbox">                             *ㄴ>메인 클릭*
              <img className="right-arrow" src = "/img/right-arrow.png"></img>
            </div> */}
            {/* 메인사진(2-3개)  / 01 버튼 (누르면 사진 슬라이드) */}
            <div className="bestsellerbox">
                {" "}
                {/* ✅ 아티클 - 카테고리 */}
                <h2 className="bs-text">카테고리 별 보기</h2>
                <div className="bs-dropdown">
                    {" "}
                    {/* ✅ 카테고리 - 드롭다운 */}
                    <select
                        value={selected}
                        onChange={handleChange}
                        className="dropdown-select"
                    >
                        <option value="1">인기순</option>
                        <option value="2">높은 가격순</option>
                        <option value="3">낮은 가격순</option>
                    </select>
                    {/* <p>선택한 값: {selected}</p>  // 선택된 값 표시 (필요시 주석 해제) */}
                </div>
                <div className="bs-group">
                    {" "}
                    {/* ✅ 카테고리 아이템 박스 그룹 */}
                    <div className="bs-box">
                        <div className="bs-img img-furniture"></div>
                        <Link to="/menu?category=furniture">
                            <button className="bs-button">#가구</button>
                        </Link>
                    </div>
                    <div className="bs-box">
                        <div className="bs-img img-kitchen"></div>
                        <Link to="/menu?category=kitchen">
                            <button className="bs-button">#주방용품</button>
                        </Link>
                    </div>
                    <div className="bs-box">
                        <div className="bs-img img-interiorobj"></div>
                        <Link to="/menu?category=interiorobj">
                            <button className="bs-button">
                                #인테리어 오브제
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <button className="discountbox">
                {" "}
                {/*✅ 아티클 - 베스트셀러 */}
                <h2 className="ds-text">인기 상품</h2>
                <ScrollbarDs
                    style={{ maxWidth: "1530px" /* 490 * 3 + gap 대략 */ }}
                >
                    {" "}
                    {/* 베스트셀러 스크롤바 */}
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div className="dsbox" key={num}>
                            <img
                                className="ds-img"
                                src={`/img/item${num}.png`}
                                alt={`item${num}`}
                            />
                        </div>
                    ))}
                </ScrollbarDs>
            </button>
            <div className="interiorbox">
                {" "}
                {/*✅아티클 - 인테리어(감각적인..)*/}
                <h2 className="itr-text">감각적인 _______를 만나보세요.</h2>
                <p className="itr-text2">
                    실제 인테리어를 적용한 모습을 확인하세요!
                </p>
                <h3 className="itr-a-h3">
                    vintage haus와 함께하는 섬세한 하루
                </h3>
                <h6 className="itr-a-h6">
                    감각적인 디테일이 공간에 스며들면, 일상은 더 깊고
                    우아해집니다. <br />
                    주방의 온기, 거실의 여유, 침실의 평온함까지
                </h6>
                <h3 className="itr-b-h3">나를 닮은 공간에서 시작하는 하루</h3>
                <h6 className="itr-b-h6">
                    눈을 뜨는 순간부터 잠들기 전까지, <br />
                    작은 소품 하나에도 당신의 감성이 스며들어요. <br />
                    지금, 집 안의 모든 공간을 새롭게 마주해보세요.
                </h6>
                <div>
                    <ImageSlider />
                    {/*인테리어 - 이미지*/}
                </div>
            </div>
            <div className="aboutbox">
                {/*✅아티클 - 어바웃어스*/}
                <MarqueeText
                    text="vintage haus"
                    fontSize="90px"
                    top="20px"
                    bottom="20px"
                />{" "}
                {/*마키 (텍스트 자동 슬라이드)*/}
                {/*어바웃어스 폰트 - 나중에 폰트 변경 후 이탤릭스타일 적용*/}
                <div className="abbox">
                    <br />
                    <h2>About us</h2> <br />
                    <br />
                    <br />
                    <p>
                        {" "}
                        Vintage Haus는 세월의 따스함을 담은 물건들을
                        큐레이션하는 감성 생활용품 브랜드입니다. <br />
                        우리는 단순히 오래된 것이 아닌, 오래도록 사랑받을 수
                        있는 디자인을 추구합니다. <br />
                        베이지, 브라운처럼 시간이 덧입혀진 컬러들로 당신의
                        공간을 채워보세요. <br />
                        새것보다 익숙함을 좋아하는 당신을 위한, 일상 속 빈티지를
                        제안합니다. <br />
                        느려도 좋으니, 예쁜 것들로 채워진 오늘을 살아가길
                        바랍니다.
                    </p>
                    <button className="ab-button">더 알아보기</button>
                </div>
            </div>
            {/* <Footer /> ✅푸터 */}
        </div>
    );
}

export default Main;
