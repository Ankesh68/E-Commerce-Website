import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
  syncWishlist,
  removeFromWishlistRedux,
} from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import Stars from "../components/Stars";
import { formatPrice, getCategoryLabel } from "../utils/format";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist.items);

  useEffect(() => {
    dispatch(syncWishlist());
    const load = () => dispatch(syncWishlist());
    window.addEventListener("wishlistUpdated", load);
    return () => window.removeEventListener("wishlistUpdated", load);
  }, [dispatch]);

  const handleRemove = (id) => dispatch(removeFromWishlistRedux(id));

  const handleAddToCart = (product) => {
    dispatch(addToCart(product, 1));
    dispatch(removeFromWishlistRedux(product.id));
  };

  return (
    <div>
      <PageHeader title="My Wishlist" curPage="Wishlist" />
      <section className="wishlist-page padding-tb">
        <div className="container">
          <div className="wishlist-heading">
            <div>
              <h3>My Wishlist</h3>
              <p>
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                <i className="icofont-heart"></i>
              </div>
              <h3>Your Wishlist is Empty</h3>
              <p>Save your favourite products here and come back to them later.</p>
              <Link to="/Shop" className="lab-btn">
                <span>Continue Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {wishlistItems.map((item) => (
                <div className="col-xl-3 col-lg-4 col-md-6 col-12" key={item.id}>
                  <div className="wishlist-card">
                    <div className="wishlist-card-image">
                      <Link to={`/shop/${item.id}`}>
                        <img
                          src={item.img || item.image}
                          alt={item.name || item.title}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </Link>
                      <button
                        type="button"
                        className="wishlist-remove"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.name} from wishlist`}
                        title="Remove from Wishlist"
                      >
                        <i className="icofont-trash"></i>
                      </button>
                    </div>
                    <div className="wishlist-card-content">
                      <p className="wishlist-seller">{getCategoryLabel(item.category)}</p>
                      <h5>
                        <Link to={`/shop/${item.id}`}>{item.name || item.title}</Link>
                      </h5>
                      <Stars
                        value={item.rating ?? item.ratings ?? 4}
                        count={item.ratingCount ?? item.ratingsCount ?? 0}
                      />
                      <h6 className="wishlist-price">{formatPrice(item.price)}</h6>
                      <div className="wishlist-actions">
                        <button
                          type="button"
                          className="lab-btn wishlist-cart-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          <i className="icofont-cart-alt"></i>
                          <span>Add To Cart</span>
                        </button>
                        <Link to={`/shop/${item.id}`} className="wishlist-view-btn">
                          <i className="icofont-eye"></i>
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
