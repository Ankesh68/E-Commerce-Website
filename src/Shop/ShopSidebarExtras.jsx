import React from "react";
import { Link } from "react-router-dom";
import { formatPrice, getCategoryLabel } from "../utils/format";
import "./ShopSidebar.css";

const POPULAR_TAGS = [
  "Backpack",
  "Shirts",
  "Jackets",
  "Jewellery",
  "Electronics",
  "Men",
  "Women",
  "Clothing",
];

const ShopSidebarExtras = ({
  products = [],
  onTagClick,
  activeTag = "",
}) => {
  const currentTag = String(activeTag || "").trim().toLowerCase();
  const popularProducts = [...products]
    .filter((product) => product?.id && (product.name || product.title))
    .sort(
      (a, b) =>
        Number(b.rating ?? b.ratings ?? 0) -
        Number(a.rating ?? a.ratings ?? 0)
    )
    .slice(0, 4);

  return (
    <div className="shop-sidebar-extras">
      <section
        className="shop-sidebar-card"
        aria-labelledby="shop-popular-products"
      >
        <div className="shop-sidebar-heading">
          <h5 id="shop-popular-products">Most Popular Products</h5>
        </div>
        {popularProducts.length ? (
          <ul className="shop-post-list">
            {popularProducts.map((product) => {
              const image = product.img || product.image;
              const name = product.name || product.title;

              return (
                <li className="shop-post-item" key={product.id}>
                  <Link to={`/shop/${product.id}`} className="shop-post-link">
                    <div className="shop-post-thumb">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          width="84"
                          height="76"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="shop-post-placeholder" aria-hidden="true">
                          <i className="icofont-image" />
                        </span>
                      )}
                    </div>
                    <div className="shop-post-copy">
                      <h6>{name}</h6>
                      <p>
                        {getCategoryLabel(product.category)} ·{" "}
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="shop-post-empty">
            Popular products will appear as the catalogue loads.
          </p>
        )}
      </section>

      <section
        className="shop-sidebar-card"
        aria-labelledby="shop-popular-tags"
      >
        <div className="shop-sidebar-heading">
          <h5 id="shop-popular-tags">Popular Tags</h5>
        </div>
        <div className="shop-tag-list">
          {POPULAR_TAGS.map((tag) => {
            const isActive = currentTag === tag.toLowerCase();

            return (
              <button
                type="button"
                key={tag}
                className={`shop-tag-btn${isActive ? " is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => onTagClick?.(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="shop-sidebar-card shop-help-card"
        aria-labelledby="shop-help-heading"
      >
        <div className="shop-sidebar-heading">
          <h5 id="shop-help-heading">Need a hand?</h5>
        </div>
        <div className="shop-help-body">
          <p>
            Questions about sizing, delivery, or your order? We are happy to
            help.
          </p>
          <Link to="/contact" className="shop-help-link">
            Contact Us <i className="icofont-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShopSidebarExtras;
