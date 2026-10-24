/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHandHoldingUsd,
  FaLock,
  FaMobileAlt,
  FaMoneyBillWave,
  FaShoppingBag,
} from "react-icons/fa";
import { formatPrice } from "../utils/format";
import {
  calcTotals,
  makeOrderRef,
  validateDelivery,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/checkout";

const PAYMENT_METHODS = [
  {
    id: "COD",
    label: "Cash on Delivery",
    desc: "Pay with cash when it arrives",
    icon: FaMoneyBillWave,
  },
  {
    id: "UPI",
    label: "UPI",
    desc: "UPI payment",
    icon: FaMobileAlt,
  },
  {
    id: "Pay on delivery",
    label: "Pay on delivery",
    desc: "Card or cash at your door",
    icon: FaHandHoldingUsd,
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
  method: "COD",
};

function SummaryThumb({ src, alt }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <span className="co-thumb" aria-hidden="true">
        <FaShoppingBag />
      </span>
    );
  }
  return (
    <span className="co-thumb">
      <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />
    </span>
  );
}

const DemoCheckout = ({ items = [], onPlaced, variant = "modal" }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState({ type: "", text: "" });
  const [isPlacing, setIsPlacing] = useState(false);
  const timerRef = useRef(null);

  const totals = useMemo(
    () => calcTotals(safeItems, appliedPromo),
    [safeItems, appliedPromo]
  );

  const itemCount = safeItems.reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0
  );
  const remainingForFree = Math.max(
    0,
    Number(
      (FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.discount)).toFixed(2)
    )
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const applyPromo = () => {
    if (!safeItems.length) return;
    const code = promo.trim().toUpperCase();
    if (!code) {
      setPromoMessage({
        type: "error",
        text: "Enter a promo code to continue.",
      });
      return;
    }
    if (code === "SAVE10") {
      setAppliedPromo("SAVE10");
      setPromo("SAVE10");
      setPromoMessage({
        type: "success",
        text: "SAVE10 applied — 10% off your order.",
      });
      return;
    }
    setAppliedPromo("");
    setPromoMessage({
      type: "error",
      text: "Invalid promo code. Use SAVE10 for 10% off.",
    });
  };

  const removePromo = () => {
    setAppliedPromo("");
    setPromo("");
    setPromoMessage({ type: "", text: "" });
  };

  const placeOrder = (event) => {
    event.preventDefault();
    if (!safeItems.length || isPlacing) return;

    const nextErrors = validateDelivery(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstKey = Object.keys(nextErrors)[0];
      window.setTimeout(() => {
        document.getElementById(`co-${firstKey}`)?.focus();
      }, 40);
      return;
    }

    setIsPlacing(true);
    timerRef.current = window.setTimeout(() => {
      const order = {
        ref: makeOrderRef(),
        at: Date.now(),
        items: safeItems.map((item) => ({ ...item })),
        totals: { ...totals },
        form: { ...form },
        method: form.method,
      };

      try {
        localStorage.setItem("demo-last-order", JSON.stringify(order));
      } catch {
        // localStorage may be unavailable — the order popup still works.
      }

      setIsPlacing(false);
      if (onPlaced) onPlaced(order);
    }, 700);
  };

  const renderField = (key, label, { full = false, ...inputProps } = {}) => {
    const id = `co-${key}`;
    const hasError = Boolean(errors[key]);
    return (
      <div className={`co-field${full ? " co-field--full" : ""}`}>
        <label className="co-label" htmlFor={id}>
          {label} <span className="co-req">*</span>
        </label>
        <input
          id={id}
          name={key}
          className="co-input"
          value={form[key]}
          onChange={(event) => updateField(key, event.target.value)}
          aria-required="true"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...inputProps}
        />
        {hasError && (
          <p className="co-error" id={`${id}-error`}>
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  if (!safeItems.length) {
    return (
      <div className="co-empty">
        <span className="co-empty-icon" aria-hidden="true">
          <FaShoppingBag />
        </span>
        <h3>Your cart is empty</h3>
        <p>Add a few products and come back to complete your order.</p>
        <Link to="/Shop" className="co-btn-secondary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <form
      className={`co-checkout co-checkout--${variant}`}
      onSubmit={placeOrder}
      noValidate
      aria-busy={isPlacing}
    >
      <div className="co-grid">
        <div className="co-main">
          <section className="co-panel" aria-labelledby="co-delivery-title">
            <div className="co-section-head">
              <span className="co-step" aria-hidden="true">
                1
              </span>
              <div>
                <h3 className="co-section-title" id="co-delivery-title">
                  Delivery details
                </h3>
                <p className="co-section-sub">
                  Tell us where you would like your order delivered.
                </p>
              </div>
            </div>

            <div className="co-fields">
              {renderField("name", "Full name", {
                placeholder: "e.g. Ankesh Raj",
                autoComplete: "name",
              })}
              {renderField("email", "Email address", {
                type: "email",
                placeholder: "you@example.com",
                autoComplete: "email",
                inputMode: "email",
              })}
              {renderField("phone", "Phone number", {
                type: "tel",
                placeholder: "+91 98765 43210",
                autoComplete: "tel",
                inputMode: "tel",
              })}
              {renderField("pincode", "Pincode / ZIP", {
                placeholder: "e.g. 110001",
                autoComplete: "postal-code",
                inputMode: "numeric",
              })}
              {renderField("address", "Address", {
                placeholder: "House no., street, area",
                autoComplete: "street-address",
                full: true,
              })}
              {renderField("city", "City", {
                placeholder: "e.g. New Delhi",
                autoComplete: "address-level2",
                full: true,
              })}
            </div>
          </section>

          <section className="co-panel" aria-labelledby="co-payment-title">
            <div className="co-section-head">
              <span className="co-step" aria-hidden="true">
                2
              </span>
              <div>
                <h3 className="co-section-title" id="co-payment-title">
                  Payment method
                </h3>
                <p className="co-section-sub">
                  Choose how you would like to pay for this order.
                </p>
              </div>
            </div>

            <fieldset className="co-payment-fieldset">
              <legend className="co-label mb-2">Select an option</legend>
              <div
                className="co-payment-grid"
                role="radiogroup"
                aria-label="Payment method"
              >
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const selected = form.method === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`co-payment-option${selected ? " is-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={method.id}
                        checked={selected}
                        onChange={() => updateField("method", method.id)}
                      />
                      <span className="co-payment-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="co-payment-copy">
                        <strong>{method.label}</strong>
                        <small>{method.desc}</small>
                      </span>
                      <span className="co-radio-dot" aria-hidden="true" />
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>
        </div>

        <aside className="co-side" aria-label="Order summary">
          <div className="co-summary-card">
            <div className="co-summary-head">
              <h3>Order summary</h3>
              <span className="co-summary-count">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <ul className="co-items">
              {safeItems.map((item) => {
                const quantity = Number(item.quantity) || 0;
                const lineTotal = (Number(item.price) || 0) * quantity;
                const name = item.name || item.title || "Product";
                return (
                  <li className="co-summary-item" key={item.id}>
                    <SummaryThumb src={item.img || item.image} alt={name} />
                    <div>
                      <p className="co-summary-name">{name}</p>
                      <p className="co-summary-meta">
                        {quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="co-summary-price">
                      {formatPrice(lineTotal)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="co-promo">
              <label className="co-promo-label" htmlFor="co-promo">
                Promo code
              </label>
              <div className="co-promo-row">
                <input
                  id="co-promo"
                  className="co-promo-input"
                  value={promo}
                  onChange={(event) => {
                    setPromo(event.target.value);
                    if (promoMessage.text) {
                      setPromoMessage({ type: "", text: "" });
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      applyPromo();
                    }
                  }}
                  placeholder="Enter promo code"
                  disabled={Boolean(appliedPromo)}
                  aria-describedby={
                    promoMessage.text ? "co-promo-message" : undefined
                  }
                />
                {appliedPromo ? (
                  <button
                    type="button"
                    className="co-promo-remove"
                    onClick={removePromo}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    className="co-promo-btn"
                    onClick={applyPromo}
                    disabled={!promo.trim()}
                  >
                    Apply
                  </button>
                )}
              </div>
              {promoMessage.text && (
                <p
                  className={`co-promo-msg is-${promoMessage.type}`}
                  id="co-promo-message"
                  role="status"
                >
                  {promoMessage.text}
                </p>
              )}
              {!appliedPromo && (
                <p className="co-promo-hint">
                  Demo code: <strong>SAVE10</strong> for 10% off.
                </p>
              )}
            </div>

            <ul className="co-totals">
              <li className="co-total-row">
                <span>Subtotal</span>
                <strong>{formatPrice(totals.subtotal)}</strong>
              </li>
              {totals.discount > 0 && (
                <li className="co-total-row co-total-row--discount">
                  <span>Discount (SAVE10)</span>
                  <strong>−{formatPrice(totals.discount)}</strong>
                </li>
              )}
              <li className="co-total-row">
                <span>Delivery</span>
                <strong>
                  {totals.delivery === 0
                    ? "Free"
                    : formatPrice(totals.delivery)}
                </strong>
              </li>
              <li className="co-total-row co-total-row--grand">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </li>
            </ul>

            <p className="co-ship-hint">
              {totals.delivery === 0
                ? "You have unlocked free delivery."
                : `Add ${formatPrice(remainingForFree)} more for free delivery.`}
            </p>
          </div>
        </aside>
      </div>

      <div className="co-action-bar">
        <div className="co-action-total">
          <span className="co-total-label">Order total</span>
          <strong className="co-total-value">
            {formatPrice(totals.total)}
          </strong>
          <span className="co-action-sub">
            {totals.delivery === 0
              ? "Free delivery included"
              : `Includes ${formatPrice(totals.delivery)} delivery`}
          </span>
        </div>
        <div className="co-action-cta">
          <button
            type="submit"
            className="co-place-order"
            disabled={isPlacing || !safeItems.length}
            aria-busy={isPlacing}
          >
            {isPlacing ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                />
                <span>Placing order…</span>
              </>
            ) : (
              <>
                <FaLock aria-hidden="true" />
                <span>Place Order</span>
              </>
            )}
          </button>
          <span className="co-secure-note">
            <FaLock aria-hidden="true" /> Secure checkout 
          </span>
        </div>
      </div>
    </form>
  );
};

export default DemoCheckout;
