import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaLock,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import { clearCart } from "../redux/slices/cartSlice";
import { fetchProductDetail } from "../redux/slices/productsSlice";
import { clampQty } from "../utils/reviews";
import DemoCheckout from "../components/DemoCheckout";
import OrderSuccessModal from "../components/OrderSuccessModal";
import logo from "../assets/images/logo/logo.png";
import "../components/checkout.css";

// Dual use (same export, no route changes):
// - <CheckoutPage /> inside CartPage renders the checkout button + modal.
// - Route /check-out renders the full checkout page (supports ?buy=<id>&qty=<n>).
const CheckoutPage = () => {
  const [show, setShow] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const {
    items: storeItems,
    detail,
    loading,
    error,
  } = useSelector((state) => state.products);

  const buyId = searchParams.get("buy");
  const buyQty = clampQty(searchParams.get("qty") || 1);
  const isPage = location.pathname.replace(/\/+$/, "") === "/check-out";

  useEffect(() => {
    if (isPage && buyId) dispatch(fetchProductDetail(buyId));
  }, [dispatch, isPage, buyId]);

  const buyProduct =
    buyId &&
    (storeItems.find((product) => String(product.id) === String(buyId)) ||
      detail);

  const buyItems = buyProduct ? [{ ...buyProduct, quantity: buyQty }] : [];
  const pageItems = buyId ? buyItems : cartItems;
  const buyLoading = Boolean(buyId) && !buyProduct && (loading || !error);
  const buyError = Boolean(buyId) && !buyProduct && !buyLoading;

  const handlePlaced = (order) => {
    // Keep the cart until the success popup is dismissed. This keeps
    // CheckoutPage mounted (CartPage unmounts it when the cart is empty) and
    // lets the order snapshot render correctly inside the popup.
    if (isPage) {
      setSuccessOrder(order);
    } else {
      setPendingOrder(order);
      setShow(false);
    }
  };

  const handleCheckoutExited = () => {
    if (!pendingOrder) return;
    setSuccessOrder(pendingOrder);
    setPendingOrder(null);
  };

  const finishOrder = () => {
    if (!buyId) dispatch(clearCart());
  };

  const handleSuccessClose = () => {
    setSuccessOrder(null);
    finishOrder();
    if (isPage) navigate("/Shop", { replace: true });
  };

  const handleContinue = () => {
    setSuccessOrder(null);
    setShow(false);
    finishOrder();
    navigate("/Shop");
  };

  const successModal = (
    <OrderSuccessModal
      show={Boolean(successOrder)}
      order={successOrder}
      onClose={handleSuccessClose}
      onContinue={handleContinue}
    />
  );

  if (isPage) {
    return (
      <div className="co-page">
        <header className="co-page-header">
          <div className="co-page-header-inner">
            <Link to="/" className="co-brand" aria-label="ShopCart home">
              <img src={logo} alt="ShopCart" />
            </Link>
            <span className="co-secure-pill">
              <FaLock aria-hidden="true" /> Secure checkout
            </span>
            <Link to="/cart-page" className="co-back-link">
              <FaArrowLeft aria-hidden="true" /> Back to cart
            </Link>
          </div>
        </header>

        <main className="co-page-main">
          <div className="co-page-intro">
            <div>
              <span className="co-eyebrow">Checkout</span>
              <h1>Complete your order</h1>
              <p>
                Review your items, add delivery details and place your 
                order securely.
              </p>
            </div>
            <div className="co-trust-row">
              <span className="co-trust-chip">
                <FaLock aria-hidden="true" /> Secure checkout
              </span>
              <span className="co-trust-chip">
                <FaTruck aria-hidden="true" /> Free delivery over $50
              </span>
              <span className="co-trust-chip">
                <FaShieldAlt aria-hidden="true" /> Demo — no real payment
              </span>
            </div>
          </div>

          {buyId && buyProduct && (
            <div className="co-buynow-banner">
              <FaShoppingBag aria-hidden="true" />
              <span>
                Buy Now:{" "}
                <strong>{buyProduct.name || buyProduct.title}</strong> ×{" "}
                {buyQty}
              </span>
            </div>
          )}

          {buyId && !buyProduct ? (
            buyError ? (
              <div className="co-empty">
                <span className="co-empty-icon" aria-hidden="true">
                  <FaShoppingBag />
                </span>
                <h3>Product not available</h3>
                <p>
                  We could not load this product. It may no longer be
                  available.
                </p>
                <Link to="/Shop" className="co-btn-secondary">
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="co-loading-card">
                <div
                  className="spinner-border text-warning"
                  role="status"
                  aria-hidden="true"
                />
                <p>Loading product details…</p>
              </div>
            )
          ) : (
            <DemoCheckout
              items={pageItems}
              variant="page"
              onPlaced={handlePlaced}
            />
          )}

          <div className="co-page-links">
            <Link to="/Shop">
              <FaArrowLeft aria-hidden="true" /> Continue shopping
            </Link>
            <Link to="/cart-page">View cart</Link>
          </div>
        </main>

        <footer className="co-page-footer">
          © 2026 ShopCart · No real orders or payments
          are processed.
        </footer>

        {successModal}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="co-checkout-trigger"
        onClick={() => setShow(true)}
      >
        <FaLock aria-hidden="true" />
        <span>Proceed to Checkout</span>
      </button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        onExited={handleCheckoutExited}
        dialogClassName="co-modal-dialog"
        contentClassName="co-modal-content"
        aria-labelledby="co-checkout-title"
        container={typeof document !== "undefined" ? document.body : undefined}
      >
        <Modal.Header closeButton className="co-modal-header">
          <div>
            <Modal.Title id="co-checkout-title">
              Secure Checkout
            </Modal.Title>
            <p className="co-modal-subtitle">
              Review your items, add delivery details and place your order.
            </p>
          </div>
        </Modal.Header>
        <Modal.Body className="co-modal-body">
          <DemoCheckout
            items={cartItems}
            variant="modal"
            onPlaced={handlePlaced}
          />
        </Modal.Body>
      </Modal>

      {successModal}
    </>
  );
};

export default CheckoutPage;
