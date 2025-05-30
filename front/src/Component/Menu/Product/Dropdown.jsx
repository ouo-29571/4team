function Dropdown({ sortOption, onChange }) {
  return (
    <select value={sortOption} onChange={onChange} className="sortDropdown">
      <option value="like">찜순</option>
      <option value="lowPrice">낮은 가격순</option>
      <option value="highPrice">높은 가격순</option>
    </select>
  );
}

export default Dropdown;
