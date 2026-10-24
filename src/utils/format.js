// Normalize a FakeStore product into the app shape. Only real API fields are
// mapped here; display-only prices are derived separately below.

export function normalizeFakeStore(p) {
  return {
    id: String(p.id),
    name: p.title,
    title: p.title,
    price: Number(p.price) || 0,
    image: p.image,
    img: p.image,
    category: p.category,
    rating: p.rating?.rate ?? 0,
    ratings: p.rating?.rate ?? 0,
    ratingCount: p.rating?.count ?? 0,
    ratingsCount: p.rating?.count ?? 0,
    description: p.description,
  };
}

export function normalizeList(list) {
  if (!Array.isArray(list)) return [];
  return list.map((p) => normalizeFakeStore(p));
}

export const formatPrice = (n) => `$${Number(n || 0).toFixed(2)}`;

// FakeStore returns a single price. The assignment also asks for an original
// price and discount, so derive a consistent display-only MRP (20% off).
const DISPLAY_DISCOUNT_RATE = 0.2;

export function getDisplayPricing(price) {
  const currentPrice = Math.max(0, Number(price) || 0);
  if (!currentPrice) {
    return { price: 0, originalPrice: 0, discountPct: 0 };
  }

  const originalPrice = +(currentPrice / (1 - DISPLAY_DISCOUNT_RATE)).toFixed(2);
  const discountPct = Math.round((1 - currentPrice / originalPrice) * 100);

  return { price: currentPrice, originalPrice, discountPct };
}

// Display label for categories. Keeps the API value intact for fetching,
// only changes what the user sees. FakeStore spells it "jewelery".
export function getCategoryLabel(category) {
  const c = String(category || "");
  const low = c.toLowerCase();
  if (low === "jewelery" || low === "jewellery") return "jewellery";
  if (low === "men's clothing" || low === "mens clothing") return "mens clothing";
  if (low === "women's clothing" || low === "womens clothing") return "womens clothing";
  return c;
}

// Map a display/URL label back to the internal/API value.
export function toApiCategory(category) {
  const c = String(category || "");
  const low = c.toLowerCase();
  if (low === "jewellery") return "jewelery";
  if (low === "mens clothing") return "men's clothing";
  if (low === "womens clothing") return "women's clothing";
  return c;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// Contact form validation. All fields are required because the contact form
// is a user-facing submission, even though this demo has no backend.
export function validateContact({ name, email, phone, subject, message } = {}) {
  const errors = {};
  const cleanName = String(name || "").trim();
  const cleanPhone = String(phone || "").trim();
  const cleanSubject = String(subject || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName) errors.name = "Name is required";
  else if (cleanName.length < 2) errors.name = "Enter at least 2 characters";

  if (!String(email || "").trim()) errors.email = "Email is required";
  else if (!validateEmail(email)) errors.email = "Enter a valid email address";

  if (!cleanPhone) errors.phone = "Phone number is required";
  else if (!/^[+\d][\d\s-]{6,18}$/.test(cleanPhone)) {
    errors.phone = "Enter a valid phone number";
  }

  if (!cleanSubject) errors.subject = "Subject is required";
  else if (cleanSubject.length < 3) {
    errors.subject = "Enter at least 3 characters";
  }

  if (!cleanMessage) errors.message = "Message is required";
  else if (cleanMessage.length < 10) {
    errors.message = "Enter at least 10 characters";
  }

  return errors;
}

// Dummy frontend-only login: any valid email + any non-empty password works.
export function validateLogin({ email, password }) {
  const errors = {};
  if (!email?.trim()) errors.email = "Email is required";
  else if (!validateEmail(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
}
