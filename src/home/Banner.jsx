import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../redux/slices/uiSlice";
import { fetchProducts } from "../redux/slices/productsSlice";
import { filterProducts } from "../utils/search";
import bannerBackground from "../assets/images/bg-img/06.jpg";

const title = (
  <h2>Search Your One From <span>Thousands </span>of Products</h2>
);
const desc = "We Have The Largest Collection of Products";

const Banner = () => {
  const [searchInput, setSearchInput] = useState("");
  const [offset, setOffset] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.products.items);

  useEffect(() => {
    dispatch(fetchProducts());
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dispatch]);

  const filtered = searchInput
    ? filterProducts(items, searchInput).slice(0, 6)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchInput.trim()));
    navigate("/Shop");
  };

  return (
    <div
      className="banner-section style-4 banner-parallax"
      style={{
        backgroundImage: `url('${bannerBackground}')`,
        transform: `translateY(${offset * 0.08}px)`,
      }}
    >
      <div className="container">
        <div className="banner-content reveal visible">
          {title}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="search"
              placeholder="Search products or categories"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit" aria-label="Search">
              <i className="icofont-search"></i>
            </button>
          </form>
          <p>{desc}</p>
          {searchInput && (
            <ul className="lab-ul bg-white rounded p-2 text-start" style={{ maxWidth: 480, margin: "0 auto" }}>
              {filtered.length === 0 && <li className="p-2 text-muted">No matches</li>}
              {filtered.map((product) => (
                <li key={product.id}>
                  <Link to={`/shop/${product.id}`}>{product.name || product.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
