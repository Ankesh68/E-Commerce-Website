import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchProducts } from "../redux/slices/productsSlice";
import { getCategoryLabel } from "../utils/format";

const subTitle = "Choose Any Products";
const title = "Buy Everything with Us";
const btnText = "Get Started Now";

// Pick a representative product for each category from the API results.
// Mens clothing includes accessories (the first result is a backpack), so
// prefer a T-shirt for that tile.
function pickCategoryProduct(category, products) {
  const inCategory = products.filter((p) => p.category === category);
  if (category === "men's clothing") {
    const tshirt = inCategory.find((p) =>
      /t[- ]?shirt/i.test(p.title || p.name || "")
    );
    if (tshirt) return tshirt;
  }
  return inCategory[0];
}

const HomeCategory = () => {
  const dispatch = useDispatch();
  const { categories, items, loading } = useSelector((s) => s.products);

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
    if (!items.length) dispatch(fetchProducts());
  }, [dispatch, categories.length, items.length]);

  const orderedCats = categories.slice(0, 6);
  const tiles = orderedCats.map((cat) => {
    const match = pickCategoryProduct(cat, items);
    return {
      title: cat,
      displayTitle: getCategoryLabel(cat),
      imgUrl: match?.image || match?.img || "",
      link: `/shop?category=${encodeURIComponent(cat)}`,
    };
  });

  return (
    <div className="category-section style-4 padding-tb">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">{subTitle}</span>
          <h2 className="title">{title}</h2>
        </div>
        <div className="section-wrapper">
          {loading && !tiles.length ? (
            <p className="text-center">Loading categories...</p>
          ) : !tiles.length ? (
            <p className="text-center text-muted">No categories found.</p>
          ) : (
            <div className="row g-4 justify-content-center row-cols-md-3 row-cols-sm-2 row-cols-1">
              {tiles.map((val) => (
                <div className="col" key={val.title}>
                  <Link to={val.link} className="category-item">
                    <div className="category-inner">
                      <div className="category-thumb">
                        {val.imgUrl ? (
                          <img src={val.imgUrl} alt={val.displayTitle} loading="lazy" />
                        ) : (
                          <div className="p-5 text-center text-muted">No image</div>
                        )}
                      </div>
                      <div className="category-content">
                        <div className="cate-icon">
                          <i className="icofont-brand-windows"></i>
                        </div>
                        <h6>{val.displayTitle}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/shop" className="lab-btn">
              <span>{btnText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategory;
