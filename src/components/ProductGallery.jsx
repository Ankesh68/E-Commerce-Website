/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FaExpand, FaTimes } from "react-icons/fa";

// FakeStore exposes a single image per product. Gallery shows the main
// image with a thumbnail strip + click-to-enlarge preview.
const ProductGallery = ({ image, name }) => {
  const [broken, setBroken] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [lens, setLens] = useState(null);
  const hasImage = Boolean(image) && !broken;

  useEffect(() => {
    setBroken(false);
    setZoomed(false);
    setLens(null);
  }, [image]);

  const onMove = (e) => {
    if (!hasImage) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLens({ x, y });
  };

  return (
    <div className="pdp-gallery">
      <div
        className="pdp-main-img"
        onMouseMove={onMove}
        onMouseLeave={() => setLens(null)}
        onClick={() => hasImage && setZoomed(true)}
        role="button"
        tabIndex={0}
        aria-label={`Enlarge ${name}`}
        onKeyDown={(e) => e.key === "Enter" && hasImage && setZoomed(true)}
      >
        {hasImage ? (
          <>
            <img
              src={image}
              alt={name}
              onError={() => setBroken(true)}
              style={
                lens
                  ? { transformOrigin: `${lens.x}% ${lens.y}%`, transform: "scale(1.8)" }
                  : undefined
              }
            />
            <span className="pdp-zoom-hint">
              <FaExpand /> Click to enlarge
            </span>
          </>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
            <i className="icofont-image" aria-hidden="true"></i>
            <span>No image available</span>
          </div>
        )}
      </div>

      {hasImage && (
        <div className="pdp-thumbs">
          <button
            type="button"
            className="pdp-thumb active"
            onClick={() => setZoomed(true)}
            aria-label="View image enlarged"
          >
            <img src={image} alt={`${name} thumbnail`} onError={() => setBroken(true)} />
          </button>
        </div>
      )}

      {zoomed && hasImage && (
        <div
          className="pdp-lightbox"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} enlarged`}
        >
          <button
            type="button"
            className="pdp-lightbox-close"
            aria-label="Close preview"
            onClick={() => setZoomed(false)}
          >
            <FaTimes />
          </button>
          <img
            src={image}
            alt={name}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          />
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
