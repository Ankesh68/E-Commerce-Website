// Frontend-only demo checkout totals. No real payment.
// Free shipping over $50, flat $4.99 below. Demo promo: SAVE10 = 10% off.

export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING = 4.99;

export function calcTotals(items = [], promo = "") {
  const list = Array.isArray(items) ? items : [];
  const subtotal = list.reduce(
    (s, i) => s + Number(i.price || 0) * (i.quantity || 0),
    0
  );
  const code = String(promo || "").trim().toUpperCase();
  const discount = code === "SAVE10" ? +(subtotal * 0.1).toFixed(2) : 0;
  const afterDiscount = subtotal - discount;
  const delivery =
    list.length === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FLAT_SHIPPING;
  const total = +(afterDiscount + delivery).toFixed(2);
  return {
    subtotal: +subtotal.toFixed(2),
    discount,
    delivery,
    total,
    promoApplied: code === "SAVE10" && subtotal > 0,
  };
}

export function validateDelivery({ name, email, phone, address, city, pincode }) {
  const errors = {};
  if (!String(name || "").trim()) errors.name = "Full name is required";
  if (!String(email || "").trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()))
    errors.email = "Enter a valid email address";
  if (!String(phone || "").trim()) errors.phone = "Phone is required";
  else if (!/^[+\d][\d\s-]{6,15}$/.test(String(phone).trim()))
    errors.phone = "Enter a valid phone number";
  if (!String(address || "").trim()) errors.address = "Address is required";
  if (!String(city || "").trim()) errors.city = "City is required";
  if (!String(pincode || "").trim()) errors.pincode = "Pincode is required";
  else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(String(pincode).trim()))
    errors.pincode = "Enter a valid pincode";
  return errors;
}

export function makeOrderRef() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DEMO-${Date.now().toString(36).toUpperCase()}-${rand}`;
}
