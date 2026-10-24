import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductDisplay from "./ProductDisplay";
import ProductGallery from "../components/ProductGallery";
import ProductReviews from "../components/ProductReviews";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import {
  fetchProductDetail,
  fetchProducts,
} from "../redux/slices/productsSlice";
import { formatPrice, getCategoryLabel } from "../utils/format";
import "./ProductDetails.css";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, loading, items } = useSelector((s) => s.products);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [tab, setTab] = useState("description");

  useEffect(() => {
    dispatch(fetchProductDetail(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    if (!items.length) dispatch(fetchProducts());
  }, [dispatch, items.length]);

  const notify = (message) => setToast({ show: true, message });
  const closeToast = () => setToast((t) => ({ ...t, show: false }));

  const related = detail
    ? [
        ...items.filter(
          (p) =>
            String(p.id) !== String(detail.id) && p.category === detail.category
        ),
        ...items.filter(
          (p) =>
            String(p.id) !== String(detail.id) && p.category !== detail.category
        ),
      ].slice(0, 4)
    : [];

  return (
    <div className="pdp-page">
      <PageHeader title="Product Details" curPage="Shop / Single Product" />
      <Toast message={toast.message} show={toast.show} onClose={closeToast} />
      <div className="container pdp-container">
        {loading && !detail ? (
          <div className="pdp-state">
            <div className="spinner-border" role="status" aria-label="Loading product" />
            <p>Loading product...</p>
          </div>
        ) : !detail ? (
          <div className="pdp-state">
            <h4>Product not found</h4>
            <p className="text-muted">
              This product is unavailable. It may have been removed or the link
              is incorrect.
            </p>
            <Link to="/shop" className="lab-btn">
              <span>Back to Shop</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="pdp-grid">
              <ProductGallery
                image={detail.img || detail.image}
                name={detail.name || detail.title}
              />
              <ProductDisplay item={detail} notify={notify} />
            </div>

            {related.length > 0 && (
              <section className="pdp-related" aria-label="Related products">
                <h3>You may also like</h3>
                <p className="text-muted small">
                  More from {getCategoryLabel(detail.category)} collection.
                </p>
                <div className="row g-4">
                  {related.map((p) => (
                    <div className="col-xl-3 col-lg-4 col-md-6 col-12" key={p.id}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="pdp-tabs" role="tablist" aria-label="Product information">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "description"}
                className={tab === "description" ? "active" : ""}
                onClick={() => setTab("description")}
              >
                Description
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "reviews"}
                className={tab === "reviews" ? "active" : ""}
                onClick={() => setTab("reviews")}
              >
                Reviews
              </button>
            </div>

            {tab === "description" ? (
              <section className="pdp-desc-panel" aria-label="Description">
                <h3>Description</h3>
                <p>{detail.description}</p>
                <h4>Specifications</h4>
                <table className="table table-bordered pdp-specs">
                  <tbody>
                    <tr><th>Product ID</th><td>{detail.id}</td></tr>
                    <tr><th>Category</th><td>{getCategoryLabel(detail.category)}</td></tr>
                    <tr>
                      <th>Price</th>
                      <td>{formatPrice(detail.price)}</td>
                    </tr>
                    <tr>
                      <th>Rating</th>
                      <td>{detail.rating ?? detail.ratings ?? 0} / 5 ({detail.ratingCount ?? detail.ratingsCount ?? 0} ratings)</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            ) : (
              <ProductReviews
                productId={detail.id}
                apiRating={detail.rating ?? detail.ratings ?? 0}
                apiCount={detail.ratingCount ?? detail.ratingsCount ?? 0}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;
