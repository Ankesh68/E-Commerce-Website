/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBolt,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaHeart,
  FaMinus,
  FaMoneyBillWave,
  FaPlus,
  FaRegHeart,
  FaShoppingCart,
  FaTag,
  FaTruck,
} from "react-icons/fa";
import StarDisplay from "../components/Stars";
import {
  formatPrice,
  getCategoryLabel,
  getDisplayPricing,
} from "../utils/format";
import { clampQty } from "../utils/reviews";
import { addToCart, isInCart } from "../redux/slices/cartSlice";
import {
  addToWishlistRedux,
  removeFromWishlistRedux,
  isInWishlistRedux,
} from "../redux/slices/wishlistSlice";

const COLOUR_OPTIONS = [
  { value: "Blue", label: "Blue", hex: "#3b82f6" },
  { value: "Black", label: "Black", hex: "#111827" },
  { value: "White", label: "White", hex: "#ffffff" },
  { value: "Yellow", label: "Yellow", hex: "#facc15" },
];

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"].map((size) => ({
  value: size,
  label: size,
}));

const OptionSelect = ({
  id,
  placeholder,
  options,
  value,
  onChange,
  showSwatch = false,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const preferredOption =
      menuRef.current.querySelector('[aria-selected="true"]') ||
      menuRef.current.querySelector('[role="option"]');
    preferredOption?.focus();
  }, [open]);

  const closeAndFocusTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const selectOption = (nextValue) => {
    onChange(nextValue);
    closeAndFocusTrigger();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      closeAndFocusTrigger();
      return;
    }

    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocusTrigger();
      return;
    }

    const isArrowKey =
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Home" ||
      event.key === "End";
    if (!isArrowKey) return;

    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll('[role="option"]') || []
    );
    if (!items.length) return;

    const currentIndex = items.indexOf(document.activeElement);
    let nextIndex;

    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else if (event.key === "ArrowDown") {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
    } else {
      nextIndex =
        currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    }

    items[nextIndex]?.focus();
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div
      className={`pdp-select${open ? " is-open" : ""}`}
      ref={rootRef}
      onBlur={handleBlur}
    >
      <button
        type="button"
        ref={triggerRef}
        id={`${id}-trigger`}
        className={`pdp-select-trigger${value ? "" : " is-placeholder"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-labelledby={`${id}-label ${id}-trigger`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="pdp-select-value">
          {showSwatch && selectedOption?.hex && (
            <span
              className="pdp-color-swatch"
              style={{ backgroundColor: selectedOption.hex }}
              aria-hidden="true"
            />
          )}
          <span className="pdp-select-label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <FaChevronDown className="pdp-select-chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul
          id={`${id}-menu`}
          ref={menuRef}
          className="pdp-select-menu"
          role="listbox"
          aria-labelledby={`${id}-label`}
          onKeyDown={handleMenuKeyDown}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`pdp-select-option${
                    isSelected ? " is-selected" : ""
                  }`}
                  onClick={() => selectOption(option.value)}
                >
                  {showSwatch && option.hex && (
                    <span
                      className="pdp-color-swatch"
                      style={{ backgroundColor: option.hex }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="pdp-select-option-label">
                    {option.label}
                  </span>
                  {isSelected && (
                    <FaCheck className="pdp-select-check" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const ProductDisplay = ({ item, notify }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inCart = useSelector((s) => isInCart(s, item?.id));
  const inWishlist = useSelector((s) => isInWishlistRedux(s, item?.id));
  const [qtyInput, setQtyInput] = useState("1");
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  if (!item) return null;
  const name = item.name || item.title;
  const { price, originalPrice, discountPct } = getDisplayPricing(item.price);
  const rating = item.rating ?? item.ratings ?? 0;
  const count = item.ratingCount ?? item.ratingsCount ?? 0;
  const quantity = clampQty(qtyInput);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const deliveryBy = deliveryDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const optionSummary = [
    selectedSize ? `Size ${selectedSize}` : "",
    selectedColour || "",
  ]
    .filter(Boolean)
    .join(", ");

  const handleQtyChange = (e) => {
    const nextValue = e.target.value;
    if (/^\d{0,2}$/.test(nextValue)) {
      setQtyInput(nextValue);
    }
  };

  const normaliseQty = () => {
    setQtyInput(String(clampQty(qtyInput)));
  };

  const stepQty = (delta) => {
    setQtyInput(String(clampQty(quantity + delta)));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setQtyInput(String(quantity));
    dispatch(addToCart(item, quantity));
    if (notify) {
      notify(
        `Added ${quantity} × “${name}”${
          optionSummary ? ` (${optionSummary})` : ""
        } to cart`
      );
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    setQtyInput(String(quantity));
    dispatch(addToCart(item, quantity));
    navigate(`/check-out?buy=${encodeURIComponent(item.id)}&qty=${quantity}`);
  };

  const handleWish = (e) => {
    e.preventDefault();
    if (inWishlist) {
      dispatch(removeFromWishlistRedux(item.id));
      if (notify) notify("Removed from wishlist");
    } else {
      dispatch(addToWishlistRedux(item));
      if (notify) notify("Saved to wishlist");
    }
  };

  return (
    <div className="pdp-info">
      <p className="pdp-id text-muted small mb-1">Product ID: {item.id}</p>
      <div className="d-flex align-items-start gap-2">
        <h2 className="pdp-title flex-grow-1">{name}</h2>
        <button
          type="button"
          onClick={handleWish}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`pdp-heart ${inWishlist ? "active" : ""}`}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <p className="mb-1">
        <Link to={`/shop?category=${encodeURIComponent(item.category || "")}`}>
          {getCategoryLabel(item.category)}
        </Link>
      </p>
      <p className="rating mb-2">
        <StarDisplay value={rating} count={count} />
      </p>

      <div className="pdp-price-row">
        <h3 className="text-success mb-1">{formatPrice(price)}</h3>
        {originalPrice > price && (
          <div className="pdp-price-meta">
            <del>{formatPrice(originalPrice)}</del>
            <span className="pdp-discount-badge">{discountPct}% OFF</span>
          </div>
        )}
      </div>
      <p className="pdp-desc">{item.description}</p>

      <form onSubmit={handleAdd} className="pdp-buybox">
        <div className="pdp-options">
          <div className="pdp-option-row">
            <span className="pdp-option-label" id="pdp-colour-label">
              Colour
            </span>
            <div className="pdp-option-control">
              <OptionSelect
                id="pdp-colour"
                placeholder="Select a colour"
                options={COLOUR_OPTIONS}
                value={selectedColour}
                onChange={setSelectedColour}
                showSwatch
              />
            </div>
          </div>

          <div className="pdp-option-row">
            <span className="pdp-option-label" id="pdp-size-label">
              Size
            </span>
            <div className="pdp-option-control">
              <OptionSelect
                id="pdp-size"
                placeholder="Select a size"
                options={SIZE_OPTIONS}
                value={selectedSize}
                onChange={setSelectedSize}
              />
            </div>
          </div>

          <div className="pdp-option-row">
            <span className="pdp-option-label" id="pdp-qty-label">
              Quantity
            </span>
            <div
              className="pdp-qty-control"
              role="group"
              aria-labelledby="pdp-qty-label"
            >
              <button
                type="button"
                className="pdp-qty-btn"
                aria-label="Decrease quantity"
                onClick={() => stepQty(-1)}
                disabled={quantity <= 1}
              >
                <FaMinus aria-hidden="true" />
              </button>
              <input
                className="pdp-qty-input"
                type="number"
                inputMode="numeric"
                min="1"
                max="99"
                value={qtyInput}
                aria-label="Quantity"
                onChange={handleQtyChange}
                onBlur={normaliseQty}
              />
              <button
                type="button"
                className="pdp-qty-btn"
                aria-label="Increase quantity"
                onClick={() => stepQty(1)}
                disabled={quantity >= 99}
              >
                <FaPlus aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="pdp-buy-actions d-flex gap-2 flex-wrap">
          <button type="submit" className="lab-btn">
            <span className="d-inline-flex align-items-center gap-2">
              <FaShoppingCart /> {inCart ? "Add More to Cart" : "Add To Cart"}
            </span>
          </button>
          <button
            type="button"
            className="lab-btn bg-primary"
            onClick={handleBuyNow}
          >
            <span className="d-inline-flex align-items-center gap-2">
              <FaBolt /> Buy Now
            </span>
          </button>
          <Link to="/cart-page" className="btn btn-outline-secondary">
            Go to Cart
          </Link>
        </div>
      </form>

      <div
        className="pdp-service-list"
        aria-label="Delivery, offers, payment and key features"
      >
        <div className="pdp-service-row">
          <span className="pdp-service-icon" aria-hidden="true">
            <FaTruck />
          </span>
          <div>
            <h4>Delivery by</h4>
            <p>{deliveryBy} · Free delivery over $50</p>
          </div>
        </div>

        <div className="pdp-service-row">
          <span className="pdp-service-icon" aria-hidden="true">
            <FaTag />
          </span>
          <div>
            <h4>Offers</h4>
            <p>
              Use <strong>SAVE10</strong> for 10% off at checkout. Free delivery
              over $50.
            </p>
          </div>
        </div>

        <div className="pdp-service-row">
          <span className="pdp-service-icon" aria-hidden="true">
            <FaMoneyBillWave />
          </span>
          <div>
            <h4>Payment options</h4>
            <p>Cash on delivery, UPI, and pay on delivery.</p>
          </div>
        </div>

        <div className="pdp-service-row">
          <span className="pdp-service-icon" aria-hidden="true">
            <FaCheckCircle />
          </span>
          <div>
            <h4>Key features</h4>
            <ul className="pdp-feature-list">
              <li>
                Quality-checked product from the{" "}
                {getCategoryLabel(item.category)} range
              </li>
              <li>7-day easy returns</li>
              <li>Secure, tamper-resistant packaging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
