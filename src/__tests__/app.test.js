import { describe, it, expect, beforeEach } from "vitest";
import {
  validateLogin,
  validateContact,
  formatPrice,
  getDisplayPricing,
  normalizeFakeStore,
} from "../utils/format";
import { cartReducer, CART_ADD, CART_REMOVE } from "../redux/slices/cartSlice";
import { wishlistReducer, WISHLIST_ADD } from "../redux/slices/wishlistSlice";
import {
  validateReview,
  calcAverage,
  calcDistribution,
  sortReviews,
  clampQty,
  saveReviews,
  loadReviews,
} from "../utils/reviews";
import { calcTotals, validateDelivery, makeOrderRef } from "../utils/checkout";
import { filterProducts } from "../utils/search";

describe("validation", () => {
  it("rejects empty login", () => {
    const e = validateLogin({ email: "", password: "" });
    expect(e.email).toBeTruthy();
    expect(e.password).toBeTruthy();
  });
  it("rejects bad email", () => {
    const e = validateLogin({ email: "bad", password: "anything" });
    expect(e.email).toBeTruthy();
  });
  it("accepts any non-empty password (dummy login)", () => {
    expect(validateLogin({ email: "xyz@gmail.com", password: "x" })).toEqual({});
  });
  it("validates every contact form field", () => {
    expect(Object.keys(validateContact({})).sort()).toEqual([
      "email",
      "message",
      "name",
      "phone",
      "subject",
    ]);
    expect(
      validateContact({
        name: "Ankesh Raj",
        email: "ankesh@example.com",
        phone: "+91 98765 43210",
        subject: "Order help",
        message: "Please help me with my recent order.",
      })
    ).toEqual({});
    expect(
      validateContact({
        name: "A",
        email: "bad",
        phone: "abc",
        subject: "Hi",
        message: "Short",
      })
    ).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      subject: expect.any(String),
      message: expect.any(String),
    });
  });
});

describe("format + normalize", () => {
  it("formats price", () => {
    expect(formatPrice(10)).toBe("$10.00");
  });
  it("derives a consistent display discount", () => {
    const pricing = getDisplayPricing(80);
    expect(pricing.price).toBe(80);
    expect(pricing.originalPrice).toBe(100);
    expect(pricing.discountPct).toBe(20);
    expect(getDisplayPricing(0)).toEqual({
      price: 0,
      originalPrice: 0,
      discountPct: 0,
    });
  });
  it("normalizes fakestore product with API fields only", () => {
    const n = normalizeFakeStore({ id: 1, title: "T", price: 100, image: "i", category: "c", rating: { rate: 4.5, count: 10 }, description: "d" });
    expect(n.price).toBe(100);
    expect(n.title).toBe("T");
    expect(n.img).toBe("i");
    expect(n.rating).toBe(4.5);
    expect(n.ratingCount).toBe(10);
    expect(n.discountPct).toBeUndefined();
    expect(n.originalPrice).toBeUndefined();
  });
});

describe("cart reducer", () => {
  it("adds and removes items", () => {
    let s = cartReducer({ items: [] }, { type: CART_ADD, payload: { product: { id: "1", name: "A", price: 10, img: "i" }, qty: 2 } });
    expect(s.items).toHaveLength(1);
    expect(s.items[0].quantity).toBe(2);
    s = cartReducer(s, { type: CART_REMOVE, payload: "1" });
    expect(s.items).toHaveLength(0);
  });
  it("computes subtotal via selector logic", () => {
    const items = [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }];
    const sub = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(sub).toBe(25);
  });
});

describe("wishlist reducer", () => {
  it("adds unique items only", () => {
    let s = wishlistReducer({ items: [] }, { type: WISHLIST_ADD, payload: { id: "1", name: "A" } });
    expect(s.items).toHaveLength(1);
    s = wishlistReducer(s, { type: WISHLIST_ADD, payload: { id: "1", name: "A" } });
    expect(s.items).toHaveLength(1);
  });
});

describe("search filter", () => {
  const catalog = [
    {
      id: "1",
      name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      category: "men's clothing",
    },
    {
      id: "2",
      name: "Mens Casual Premium Slim Fit T-Shirts",
      category: "men's clothing",
    },
    {
      id: "5",
      name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
      category: "jewelery",
    },
    {
      id: "9",
      name: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
      category: "electronics",
    },
    {
      id: "20",
      name: "DANVOUY Womens T Shirt Casual Cotton Short",
      category: "women's clothing",
    },
  ];
  const ids = (products) => products.map((p) => p.id);

  it("returns all products for an empty query", () => {
    expect(filterProducts(catalog, "")).toHaveLength(catalog.length);
  });

  it("filters by product name", () => {
    expect(ids(filterProducts(catalog, "backpack"))).toEqual(["1"]);
  });

  it("matches jewellery and jewelry aliases", () => {
    expect(ids(filterProducts(catalog, "jewellery"))).toEqual(["5"]);
    expect(ids(filterProducts(catalog, "jewelry"))).toEqual(["5"]);
    expect(ids(filterProducts(catalog, "jewelery"))).toEqual(["5"]);
  });

  it("matches category names and synonyms", () => {
    expect(ids(filterProducts(catalog, "electronics"))).toEqual(["9"]);
    expect(ids(filterProducts(catalog, "mens clothing"))).toEqual(["1", "2"]);
    expect(ids(filterProducts(catalog, "womens"))).toEqual(["20"]);
  });

  it("normalizes t-shirt spellings", () => {
    expect(ids(filterProducts(catalog, "tshirt"))).toEqual(["2", "20"]);
    expect(ids(filterProducts(catalog, "t-shirt"))).toEqual(["2", "20"]);
    expect(ids(filterProducts(catalog, "t shirt"))).toEqual(["2", "20"]);
    expect(ids(filterProducts(catalog, "TSHIRT"))).toEqual(["2", "20"]);
  });

  it("combines title and category words", () => {
    expect(ids(filterProducts(catalog, "mens tshirt"))).toEqual(["2"]);
  });
});

describe("quantity guards", () => {
  it("clamps to 1..99 and handles garbage", () => {
    expect(clampQty(0)).toBe(1);
    expect(clampQty(-5)).toBe(1);
    expect(clampQty(3)).toBe(3);
    expect(clampQty(200)).toBe(99);
    expect(clampQty("abc")).toBe(1);
    expect(clampQty("5")).toBe(5);
  });
});

describe("cart upsert", () => {
  it("merges duplicate product instead of duplicating", () => {
    const p = { id: "7", name: "Bag", price: 20, img: "i" };
    let s = cartReducer({ items: [] }, { type: CART_ADD, payload: { product: p, qty: 2 } });
    s = cartReducer(s, { type: CART_ADD, payload: { product: p, qty: 3 } });
    expect(s.items).toHaveLength(1);
    expect(s.items[0].quantity).toBe(5);
  });
});

describe("reviews (frontend-only)", () => {
  beforeEach(() => localStorage.clear());
  it("validates review fields", () => {
    expect(validateReview({ name: "", rating: 0, title: "", text: "" })).toEqual({
      name: expect.anything(),
      rating: expect.anything(),
      title: expect.anything(),
      text: expect.anything(),
    });
    expect(validateReview({ name: "A", rating: 5, title: "Nice", text: "Long enough text here" })).toEqual({});
  });
  it("computes average + distribution + sorting", () => {
    const rs = [
      { rating: 5, date: "2026-01-01" },
      { rating: 3, date: "2026-02-01" },
      { rating: 4, date: "2026-03-01" },
    ];
    expect(calcAverage(rs)).toBe(4);
    expect(calcDistribution(rs)).toEqual({ 5: 1, 4: 1, 3: 1, 2: 0, 1: 0 });
    expect(sortReviews(rs, "highest")[0].rating).toBe(5);
    expect(sortReviews(rs, "newest")[0].rating).toBe(4);
  });
  it("persists reviews in localStorage", () => {
    saveReviews("p1", [{ id: "a", rating: 5 }]);
    expect(loadReviews("p1")).toHaveLength(1);
  });
});

describe("demo checkout totals", () => {
  it("sums subtotal, free shipping over $50, SAVE10 discount", () => {
    const t1 = calcTotals([{ price: 30, quantity: 2 }]);
    expect(t1.subtotal).toBe(60);
    expect(t1.delivery).toBe(0);
    const t2 = calcTotals([{ price: 10, quantity: 1 }]);
    expect(t2.delivery).toBe(4.99);
    const t3 = calcTotals([{ price: 100, quantity: 1 }], "SAVE10");
    expect(t3.discount).toBe(10);
    expect(t3.promoApplied).toBe(true);
    expect(calcTotals([], "SAVE10").promoApplied).toBe(false);
  });
  it("validates delivery form + makes demo order ref", () => {
    expect(Object.keys(validateDelivery({})).length).toBeGreaterThan(0);
    expect(
      validateDelivery({ name: "A B", email: "a@b.com", phone: "+911234567890", address: "Street 1", city: "Delhi", pincode: "110001" })
    ).toEqual({});
    expect(makeOrderRef().startsWith("DEMO-")).toBe(true);
  });
});

describe("related products", () => {
  it("excludes current product and prefers same category", () => {
    const items = [
      { id: "1", category: "c1" },
      { id: "2", category: "c1" },
      { id: "3", category: "c2" },
    ];
    const current = { id: "1", category: "c1" };
    const rel = [
      ...items.filter((p) => String(p.id) !== String(current.id) && p.category === current.category),
      ...items.filter((p) => String(p.id) !== String(current.id) && p.category !== current.category),
    ].slice(0, 4);
    expect(rel.find((p) => p.id === "1")).toBeUndefined();
    expect(rel[0].id).toBe("2");
  });
});

describe("pdp extras", () => {
  it("email is optional in reviews but validated when given", () => {
    const base = { name: "A", rating: 5, title: "Nice product", text: "Long enough text here" };
    expect(validateReview({ ...base, email: "" })).toEqual({});
    expect(validateReview({ ...base, email: "not-an-email" }).email).toBeTruthy();
    expect(validateReview({ ...base, email: "a@b.com" })).toEqual({});
  });
});
