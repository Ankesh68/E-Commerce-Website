/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import Stars from "./Stars";
import { formatPrice, getDisplayPricing } from "../utils/format";
import { addToCart, isInCart } from "../redux/slices/cartSlice";
import {
  addToWishlistRedux,
  removeFromWishlistRedux,
  isInWishlistRedux,
} from "../redux/slices/wishlistSlice";

// Whole card is clickable → product details. Inner buttons stop
// propagation so they perform only their own action.
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inCart = useSelector((s) => isInCart(s, product.id));
  const inWishlist = useSelector((s) => isInWishlistRedux(s, product.id));
  const [imgBroken, setImgBroken] = useState(false);

  const img = product.img || product.image;
  const name = product.name || product.title;
  const { price, originalPrice, discountPct } = getDisplayPricing(
    product.price
  );
  const rating = product.rating ?? product.ratings ?? 0;
  const count = product.ratingCount ?? product.ratingsCount ?? 0;

  const openDetails = () => navigate(`/shop/${product.id}`);

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) navigate("/cart-page");
    else dispatch(addToCart(product, 1));
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) dispatch(removeFromWishlistRedux(product.id));
    else dispatch(addToWishlistRedux(product));
  };

  return (
    <div
      className="product-item tw-card-hover h-100 d-flex flex-column product-card-clickable"
      onClick={openDetails}
      role="link"
      tabIndex={0}
      aria-label={`View details of ${name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter") openDetails();
      }}
    >
      <div className="product-thumb position-relative">
        <div className="pro-thumb">
          {imgBroken || !img ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-muted w-100"
              style={{ minHeight: 220 }}
            >
              <i className="icofont-image" aria-hidden="true"></i>
              <small>No image</small>
            </div>
          ) : (
            <img
              src={img}
              alt={name}
              loading="lazy"
              onError={() => setImgBroken(true)}
            />
          )}
        </div>
        <button
          onClick={handleWish}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
        >
          {inWishlist ? <FaHeart className="text-danger" /> : <FaRegHeart />}
        </button>
      </div>
      <div className="product-content d-flex flex-column flex-grow-1">
        <h5 className="line-clamp-2" style={{ minHeight: 44 }}>
          {name}
        </h5>
        <p className="productRating mb-1">
          <Stars value={rating} count={count} />
        </p>
        <div className="product-price-row d-flex align-items-baseline flex-wrap gap-2 mb-2">
          <h6 className="mb-0 text-success">{formatPrice(price)}</h6>
          {originalPrice > price && (
            <>
              <del className="product-price-original">
                {formatPrice(originalPrice)}
              </del>
              <span className="product-discount-badge">
                {discountPct}% OFF
              </span>
            </>
          )}
        </div>
        <button onClick={handleCart} className={`lab-btn mt-auto ${inCart ? "bg-primary" : ""}`}>
          <span className="d-inline-flex align-items-center gap-2">
            <FaShoppingCart /> {inCart ? "Go to Cart" : "Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
