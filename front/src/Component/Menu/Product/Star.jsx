import { useState } from 'react';

const Star = () => {
    const [nowClicked, setNowClicked] = useState(0); // 클릭된 별 번호 저장
    const handleClick = (num) => {
        setNowClicked(num);
        alert(`${num}점 감사합니다다.`);
    };

    return (
        <div>
            <div className="inner_left_Star">  {/* 별이 다섯개 */}
                <div style={{ fontSize: "20px", cursor: "pointer", color: "black" }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <span
                            key={num}
                            onClick={() => handleClick(num)}
                            style={{ color: num <= nowClicked ? "black" : "gray" }} >
                            {num <= nowClicked ? "★" : "☆"}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Star;
