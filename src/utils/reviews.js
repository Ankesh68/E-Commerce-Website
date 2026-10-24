// User-submitted reviews. Persisted per product in localStorage.
// Key: product-reviews-<productId>. Browser-only.

const keyFor = (productId) => `product-reviews-${String(productId)}`;

function safeParse(raw, defaultValue) {
  try {
    const v = JSON.parse(raw);
    return v ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export function loadReviews(productId) {
  try {
    const raw = localStorage.getItem(keyFor(productId));
    const list = safeParse(raw, []);
    if (!Array.isArray(list)) return [];
    // Ignore reviews created by the old seeded/demo review system.
    return list.filter(
      (r) => !r?.demo && !String(r?.id || "").includes("-seed-")
    );
  } catch {
    return [];
  }
}

export function saveReviews(productId, reviews) {
  try {
    localStorage.setItem(keyFor(productId), JSON.stringify(reviews));
  } catch {
    // ignore quota errors
  }
}

export function getReviews(productId) {
  return loadReviews(productId);
}

export function addReview(productId, { name, email, rating, title, text }) {
  const mail = String(email || "").trim().slice(0, 80);
  const review = {
    id: `${productId}-${Date.now()}`,
    name: String(name || "Anonymous").trim().slice(0, 40) || "Anonymous",
    email: mail || undefined,
    date: new Date().toISOString(),
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    title: String(title || "").trim().slice(0, 80),
    text: String(text || "").trim().slice(0, 1000),
  };
  const existing = loadReviews(productId);
  const next = [review, ...existing];
  saveReviews(productId, next);
  return review;
}

export function validateReview({ name, email, rating, title, text }) {
  const errors = {};
  if (!String(name || "").trim()) errors.name = "Name is required";
  if (String(email || "").trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()))
    errors.email = "Enter a valid email address";
  const r = Number(rating);
  if (!r || r < 1 || r > 5) errors.rating = "Pick a rating from 1 to 5";
  if (!String(title || "").trim()) errors.title = "Title is required";
  else if (String(title).trim().length < 4) errors.title = "Title is too short";
  if (!String(text || "").trim()) errors.text = "Review is required";
  else if (String(text).trim().length < 10)
    errors.text = "Please write at least 10 characters";
  return errors;
}

export function calcAverage(reviews) {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
  return +(sum / reviews.length).toFixed(1);
}

export function calcDistribution(reviews) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const k = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0)));
    dist[k] += 1;
  });
  return dist;
}

export function sortReviews(reviews, mode = "newest") {
  const list = [...(reviews || [])];
  if (mode === "highest") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return list;
}

export function clampQty(qty, min = 1, max = 99) {
  const n = parseInt(qty, 10);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
