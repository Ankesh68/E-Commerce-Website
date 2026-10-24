/* eslint-disable react/prop-types */
import React from "react";
import ProductCard from "../components/ProductCard";

// Grid view only (list view removed per design).
const ProductCards = ({ products }) => {
  if (!products?.length) {
    return <p className="text-center text-muted py-5">No products found.</p>;
  }
  return (
    <div className="shop-product-wrap row justify-content-center grid">
      {products.map((product) => (
        <div className="col-lg-4 col-md-6 col-12 mb-4" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
