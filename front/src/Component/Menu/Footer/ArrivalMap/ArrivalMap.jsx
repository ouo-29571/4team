import React from "react";
import "./ArrivalMap.css";
const ArrivalMap = () => {
  return (
    <main className="Am-Main">
      <div className="Am-All">
        <div className="Am-Text">
          {/*✅ 고객센터 */}
          <h2>오시는 길</h2>
        </div>
        <div className="Am-Box">
          <div className="Am-Box_QnA1">
            <div className="Am-QnA1">
              <img
                src="../../../../img/map.png"
                alt="찾아오시는 길_지도"
                style={{
                  width: "1000px",
                  height: "600px",
                  borderRadius: "70px",
                }}
              />
            </div>
          </div>
          <div className="Am-Box_QnA2">
            <div className="Am-QnA2_map" >
                <div className="Am-QnA2_map_ping"> <img src="../../../../img/Location.png" alt="" />  </div>
                <div>
              <h2> 경기도 화성시 떡전골로 97</h2>
              <h3> 병점역 1번 출구 바로앞</h3>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="Am-QnA2">
                <h3>도 로 명</h3>
                <h3>지 번</h3>
                <h3>우 편 번 호</h3>
              </div>
              <div className="Am-QnA3">
                <h3>경기도 화성시 떡전골로 97</h3>
                <h3>경기도 화성시 병점동 527</h3>
                <h3>18412</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArrivalMap;
