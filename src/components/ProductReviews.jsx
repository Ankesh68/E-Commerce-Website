/* eslint-disable react/prop-types */
import React, { useMemo, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import Stars from "./Stars";
import {
  getReviews,
  addReview,
  validateReview,
  calcAverage,
  calcDistribution,
  sortReviews,
} from "../utils/reviews";

const PAGE_SIZE = 3;

const StarInput = ({ value, onChange }) => (
  <div className="pdp-star-input" role="radiogroup" aria-label="Your rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={value === n}
        aria-label={`${n} star${n > 1 ? "s" : ""}`}
        className={n <= value ? "on" : ""}
        onClick={() => onChange(n)}
      >
        {n <= value ? <FaStar /> : <FaRegStar />}
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId, apiRating = 0, apiCount = 0 }) => {
  const [reviews, setReviews] = useState(() => getReviews(productId));
  const [sort, setSort] = useState("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, title: "", text: "" });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  const sorted = useMemo(() => sortReviews(reviews, sort), [reviews, sort]);
  const shown = sorted.slice(0, visible);
  const avg = calcAverage(reviews);
  const dist = calcDistribution(reviews);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateReview(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const created = addReview(productId, form);
    setReviews(getReviews(productId));
    setForm({ name: "", email: "", rating: 5, title: "", text: "" });
    setFormOpen(false);
    setVisible((v) => Math.max(v, PAGE_SIZE));
    setNotice(`Thanks! Your review “${created.title}” was saved in this browser.`);
  };

  return (
    <section className="pdp-reviews" aria-label="Customer reviews">
      <h3>Customer Reviews</h3>
      <p className="text-muted small">
        Share your experience with other shoppers. {apiCount > 0 && (
          <>Overall rating: {apiRating}/5 ({apiCount} ratings).</>
        )}
      </p>

      <div className="pdp-rev-summary">
        <div className="pdp-rev-avg">
          <span className="pdp-rev-big">{avg || "—"}</span>
          <Stars value={avg} count={reviews.length} />
          <small className="text-muted">{reviews.length} review(s)</small>
        </div>
        <div className="pdp-rev-dist">
          {[5, 4, 3, 2, 1].map((s) => (
            <div className="pdp-rev-row" key={s}>
              <span>{s}★</span>
              <div className="pdp-rev-bar">
                <div
                  className="pdp-rev-fill"
                  style={{
                    width: reviews.length
                      ? `${(dist[s] / reviews.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <span>{dist[s]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pdp-rev-tools">
        <label>
          Sort{" "}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="highest">Highest rated</option>
          </select>
        </label>
        <button
          type="button"
          className="lab-btn"
          onClick={() => setFormOpen((v) => !v)}
        >
          <span>{formOpen ? "Cancel" : "Add Review"}</span>
        </button>
      </div>

      {notice && <p className="alert alert-success py-2">{notice}</p>}

      {formOpen && (
        <form className="pdp-rev-form" onSubmit={submit} noValidate>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Your name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="col-md-6">
              <StarInput
                value={form.rating}
                onChange={(n) => setForm({ ...form, rating: n })}
              />
              {errors.rating && <small className="text-danger">{errors.rating}</small>}
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Email (optional, not displayed)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <div className="col-12">
              <input
                className="form-control"
                placeholder="Review title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              {errors.title && <small className="text-danger">{errors.title}</small>}
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                rows="3"
                placeholder="What did you like or dislike? *"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
              {errors.text && <small className="text-danger">{errors.text}</small>}
            </div>
            <div className="col-12 d-flex gap-2">
              <button type="submit" className="lab-btn">
                <span>Submit Review</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="pdp-rev-list">
        {shown.map((r) => (
          <article className="pdp-rev-card" key={r.id}>
            <header>
              <strong>{r.name}</strong>
              <Stars value={r.rating} />
            </header>
            <p className="pdp-rev-title">{r.title}</p>
            <p>{r.text}</p>
            <footer className="text-muted small">
              {new Date(r.date).toLocaleDateString()} · browser-only
            </footer>
          </article>
        ))}
        {!shown.length && <p className="text-muted">No reviews yet — be the first.</p>}
      </div>

      {visible < sorted.length && (
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
        >
          Load More ({sorted.length - visible} remaining)
        </button>
      )}
    </section>
  );
};

export default ProductReviews;
