import { useState } from 'react';

const Star = ({ productId }) => {
  const [nowClicked, setNowClicked] = useState(0); // 클릭된 별 번호 저장
  
  // ⭐️ POST 요청 보내서 product_ratings 테이블에 INSERT
  const handleClick = async (num) => {
    setNowClicked(num);
    alert(`${num}점 감사합니다.`);

    try {
      const res = await fetch(
        `http://localhost:8080/api/products/${productId}/rating`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating: num }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("별점 등록 성공:", data);
    } catch (error) {
      console.error("별점 등록 실패:", error);
    }
  };

  return (
    <div>
      <div className="inner_left_Star">
        <div style={{ fontSize: "20px", cursor: "pointer", color: "black" }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => handleClick(num)}
              style={{ color: num <= nowClicked ? "black" : "gray" }}>
              {num <= nowClicked ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Star;
