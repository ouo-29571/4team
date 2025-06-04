import { useState, useMemo, useEffect } from "react";
import "./Menu.css";
import Dropdown from "./product/Dropdown";
//import projectsData from "./product/data";
import ProductGrid from "./product/ProductGrid";
import Footer from './Footer/Footer';

function Menu() {
  const [sortOption, setSortOption] = useState("like");
  const [category, setCategory] = useState("decoration");
  const [productsData, setProductsData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/api/test")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProductsData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []); // ⭐️ 한번만 실행
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };
  const filteredData = useMemo(() => {
    if (category === "decoration") {
      return productsData.filter(
        (item) => item.product_id >= 1 && item.product_id <= 100
      ); // 👉 DB 데이터에 맞게 key 변경
    } else if (category === "furniture") {
      return productsData.filter(
        (item) => item.product_id >= 101 && item.product_id <= 200
      );
    } else if (category === "kitchen") {
      return productsData.filter(
        (item) => item.product_id >= 201 && item.product_id <= 300
      );
    }
    return productsData;
  }, [category, productsData]); // 👉 productsData 추가

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortOption === "like") {
      sorted.sort((a, b) => (b.like || 0) - (a.like || 0));
    } else if (sortOption === "lowPrice") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highPrice") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted.slice(0, 9);
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
              <ProductGrid items={sortedData} /> {/* 그리드 배열 3 * ~ */}
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
