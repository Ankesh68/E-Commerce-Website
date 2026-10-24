import React from "react";
import { useDispatch } from "react-redux";
import { fetchByCategory, fetchProducts } from "../redux/slices/productsSlice";
import { getCategoryLabel } from "../utils/format";

const title = "All Categories";

// FakeStore categories come via Redux
const ShopCategory = ({ filterItem, menuItems = [], selectedCategory }) => {
  const dispatch = useDispatch();

  const handleAll = () => {
    if (filterItem) filterItem("All");
    else {
      dispatch(fetchProducts());
    }
  };

  const handleCat = (cat) => {
    if (filterItem) filterItem(cat);
    else dispatch(fetchByCategory(cat));
  };

  const cats = menuItems || [];

  return (
    <>
      <div className="widget-header">
        <h5 className="ms-2">{title}</h5>
      </div>
      <div className="d-flex flex-wrap">
        <button
          className={`m-2 btn btn-sm ${selectedCategory === "All" ? "btn-warning" : "btn-outline-secondary"}`}
          onClick={handleAll}
        >
          All
        </button>
        {cats.map((val, id) => (
          <button
            className={`m-2 btn btn-sm ${selectedCategory === val ? "btn-warning" : "btn-outline-secondary"}`}
            onClick={() => handleCat(val)}
            key={id}
          >
            {getCategoryLabel(val)}
          </button>
        ))}
      </div>
    </>
  );
};

export default ShopCategory;
