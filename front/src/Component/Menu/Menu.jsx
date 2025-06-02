import { useState, useMemo } from "react";
import "./Menu.css";
import Dropdown from "./product/Dropdown";
import projectsData from "./product/data";
import ProductGrid from "./product/ProductGrid";
import Footer from "./Footer";

function Menu() {
  const [sortOption, setSortOption] = useState("like");
  const [category, setCategory] = useState("decoration");
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };
  const filteredData = useMemo(() => {
    if (category === "decoration") {
      return projectsData.filter((item) => item.id >= 1 && item.id <= 100);
    } else if (category === "furniture") {
      return projectsData.filter((item) => item.id >= 101 && item.id <= 200);
    } else if (category === "kitchen") {
      return projectsData.filter((item) => item.id >= 201 && item.id <= 300);
    }
    return projectsData;
  }, [category]);
  // 🔴 필터된 데이터에서 정렬 + 9개씩 잘라내기
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortOption === "like") {
      sorted.sort((a, b) => (b.like || 0) - (a.like || 0));
    } else if (sortOption === "lowPrice") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highPrice") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted.slice(0, 9); // 🔴 9개까지만 보여주기
  }, [filteredData, sortOption]);
  return (
    <div>
      <main>
        <div className="big_Box">
          {/* 큰네모 */}
          <div className="up_Box">
            {/* 위네모 */}
            <button
              className={`up_Box_button ${
                category === "furniture" ? "active" : ""
              }`} // 🔴 선택된 카테고리 버튼에 active 클래스 추가
              onClick={() => handleCategoryChange("furniture")} // 🔴 클릭 시 카테고리 변경
            >
              가구
            </button>
            <button
              className={`up_Box_button ${
                category === "kitchen" ? "active" : ""
              }`} // 🔴 선택된 카테고리 버튼에 active 클래스 추가
              onClick={() => handleCategoryChange("kitchen")} // 🔴 클릭 시 카테고리 변경
            >
              주방용품
            </button>
            <button
              className={`up_Box_button ${
                category === "decoration" ? "active" : ""
              }`} // 🔴 선택된 카테고리 버튼에 active 클래스 추가
              onClick={() => handleCategoryChange("decoration")} // 🔴 클릭 시 카테고리 변경
            >
              장식구
            </button>
          </div>
          <div>
            <Dropdown sortOption={sortOption} onChange={handleSortChange} />{" "}
            {/*  찜높은순 가격높은순 가격낮은순 */}
          </div>
          <div className="down_Box">
            {/* 아래래네모 */}

            <div className="grid_Box">
              <ProductGrid items={sortedData} /> {/* 그리드 배열 3 * 3 */}
            </div>
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Menu;
