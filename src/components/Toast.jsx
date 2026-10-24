import React, { useEffect } from "react";

// Lightweight success/info toast. No new dependencies.
const Toast = ({ message, show, onClose, variant = "success" }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div
      className={`pdp-toast alert alert-${variant} shadow`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        type="button"
        className="btn-close ms-2"
        aria-label="Dismiss"
        onClick={onClose}
      />
    </div>
  );
};

export default Toast;
