import React, { useState } from "react";
import { Link } from "react-router-dom";
import { filterProducts } from "../utils/search";

const Search = ({ products = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = filterProducts(products, searchTerm);
  return (
    <div className="widget widget-search">
      <form className="search-wrapper mb-3" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search products or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />
        <button type="submit">
          <i className="icofont-search-2"></i>
        </button>
      </form>
      <div>
        {searchTerm &&
          filteredProducts.slice(0, 5).map((product) => (
            <Link key={product.id} to={`/shop/${product.id}`}>
              <div className="d-flex gap-3 p-2">
                <div className="pro-thumb h-25">
                  <img
                    src={product.img || product.image}
                    alt={product.name || product.title}
                    width={70}
                  />
                </div>
                <div className="product-content">
                  <p>{product.name || product.title}</p>
                  <h6>${product.price}</h6>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Search;
