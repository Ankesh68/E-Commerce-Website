/* eslint-disable react/prop-types */
import React from "react";
import { Modal } from "react-bootstrap";
import { FaCheck, FaInfoCircle } from "react-icons/fa";
import { formatPrice } from "../utils/format";
import "./checkout.css";

function paymentLabel(method) {
  if (method === "COD") return "Cash on Delivery";
  return method || "Cash on Delivery";
}

const OrderSuccessModal = ({ show, order, onClose, onContinue }) => {
  if (!order) return null;

  const itemCount = (order.items || []).reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0
  );
  const customerName = order.form?.name?.trim();

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard
      dialogClassName="co-success-dialog"
      contentClassName="co-success-content"
      aria-labelledby="co-success-title"
      container={typeof document !== "undefined" ? document.body : undefined}
    >
      <Modal.Body>
        <div className="co-success-icon" aria-hidden="true">
          <FaCheck />
        </div>
        <h3 className="co-success-title" id="co-success-title">
          Order placed successfully!
        </h3>
        <p className="co-success-sub">
          {customerName ? `Thank you, ${customerName}. ` : "Thank you. "}
          Your order has been confirmed and saved in this browser.
        </p>

        <div className="co-success-ref">
          <span>Order reference</span>
          <code>{order.ref}</code>
        </div>

        <div className="co-success-summary">
          <div className="co-success-stat">
            <span>Items</span>
            <strong>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </strong>
          </div>
          <div className="co-success-stat">
            <span>Total</span>
            <strong>{formatPrice(order.totals?.total)}</strong>
          </div>
          <div className="co-success-stat">
            <span>Payment</span>
            <strong>{paymentLabel(order.method)}</strong>
          </div>
        </div>

        <p className="co-success-note">
          <FaInfoCircle aria-hidden="true" />
           Your payment is secure and safe .
        </p>

        <div className="co-success-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn co-btn-primary"
            onClick={onContinue}
          >
            Continue Shopping
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderSuccessModal;
