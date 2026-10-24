import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/images/logo/logo.png";
import { selectCartCount, syncCartFromStorage } from "../redux/slices/cartSlice";
import { selectWishlistCount, syncWishlist } from "../redux/slices/wishlistSlice";
import { selectUser, dummyLogout } from "../redux/slices/authSlice";
import { setSearchTerm } from "../redux/slices/uiSlice";

const NavItems = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const wishCount = useSelector(selectWishlistCount);
  const user = useSelector(selectUser);
  const globalSearch = useSelector((s) => s.ui.searchTerm);

  useEffect(() => {
    dispatch(syncCartFromStorage());
    dispatch(syncWishlist());
    const onCart = () => dispatch(syncCartFromStorage());
    const onWish = () => dispatch(syncWishlist());
    window.addEventListener("cartUpdated", onCart);
    window.addEventListener("wishlistUpdated", onWish);
    const onScroll = () => setHeaderFixed(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("cartUpdated", onCart);
      window.removeEventListener("wishlistUpdated", onWish);
      window.removeEventListener("scroll", onScroll);
    };
  }, [dispatch]);

  useEffect(() => {
    setLocalSearch(globalSearch || "");
  }, [globalSearch]);

  const submitSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearch.trim()));
    navigate("/Shop");
  };

  const handleLogout = () => {
    dispatch(dummyLogout());
    navigate("/");
  };

  return (
    <header
      className={`header-section style-4 ${
        headerFixed ? "header-fixed fadeInUp" : ""
      }`}
      style={{ position: "sticky", top: 0, zIndex: 1020 }}
    >
      <div className={`header-top d-md-none ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            {!user ? (
              <span className="d-flex gap-3">
                <Link to="/login">Log In</Link>
                <Link to="/signup">Sign Up</Link>
              </span>
            ) : (
              <span className="text-white">Hi, {user.name}</span>
            )}
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo-search-acte">
              <div className="logo">
                <Link to={"/"}>
                  <img src={logo} alt="ShopCart" />
                </Link>
              </div>
            </div>

            <div className="menu-area">
              <div className="menu">
                <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/Shop">Shop</Link></li>
                  <li><Link to="/About">About</Link></li>
                  <li><Link to="/Contact">Contact</Link></li>
                  {!user && (
                    <>
                      <li className="d-md-none"><Link to="/login">Log In</Link></li>
                      <li className="d-md-none"><Link to="/signup">Sign Up</Link></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Search toggle */}
              <button
                className="btn btn-light btn-sm rounded-circle"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Toggle search"
                title="Search products"
              >
                <FaSearch />
              </button>

              {/* Wishlist with badge */}
              <Link
                to="/wishlist-page"
                className="btn btn-light btn-sm rounded-circle position-relative"
                title="Wishlist"
                aria-label={`Wishlist, ${wishCount} items`}
              >
                <FaHeart />
                {wishCount > 0 && (
                  <span className="tw-badge bg-danger text-white">{wishCount}</span>
                )}
              </Link>

              {/* Cart with badge */}
              <Link
                to="/cart-page"
                className="btn btn-light btn-sm rounded-circle position-relative"
                title="Cart"
                aria-label={`Cart, ${cartCount} items`}
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="tw-badge bg-success text-white">{cartCount}</span>
                )}
              </Link>

              {/* Notifications */}
              <div className="position-relative">
                <button
                  className="btn btn-light btn-sm rounded-circle"
                  onClick={() => setShowNotifications((v) => !v)}
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <FaBell />
                </button>
                {showNotifications && (
                  <div
                    className="card position-absolute end-0 mt-2 p-3 shadow"
                    style={{ width: 260, zIndex: 1050 }}
                  >
                    <h6 className="mb-2">Notifications</h6>
                    <small className="text-muted d-block">Big Sale: up to 50% off electronics</small>
                    <small className="text-muted d-block">Free shipping over $50</small>
                  </div>
                )}
              </div>

              {/* Auth */}
              {!user ? (
                <div className="d-none d-md-flex align-items-center gap-2">
                  <Link to="/login" className="d-flex align-items-center gap-1">
                    <FaUser /> Log In
                  </Link>
                  <Link to="/signup" className="btn btn-warning btn-sm">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="d-none d-md-flex align-items-center gap-2">
                  <span className="small">Hi, {user.name}</span>
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}

              <div
                className={`header-bar d-lg-none ${menuToggle ? "active" : ""}`}
                onClick={() => setMenuToggle(!menuToggle)}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div
                className="ellepsis-bar d-md-none"
                onClick={() => setSocialToggle(!socialToggle)}
              >
                <i className="icofont-info-square"></i>
              </div>
            </div>
          </div>

          {searchOpen && (
            <form onSubmit={submitSearch} className="d-flex gap-2 py-2">
              <input
                className="form-control"
                placeholder="Search products or categories..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                aria-label="Search products"
              />
              <button className="lab-btn" type="submit">
                <span>Search</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavItems;
