import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import HomeCategory from "./HomeCategory";
import WhatWeSell from "../components/WhatWeSell";
import FaqAccordion from "../components/FaqAccordion";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../redux/slices/productsSlice";
import { useReveal } from "../hooks/useReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Home = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.products);
  useReveal([items.length]);

  useEffect(() => {
    if (!items.length) dispatch(fetchProducts());
  }, [dispatch, items.length]);

  const featured = items.slice(0, 8);

  return (
    <div>
      <Banner />
      <HomeCategory />

      {/* Curated products */}
      <section className="course-section style-3 padding-tb">
        <div className="container">
          <div className="section-header text-center reveal">
            <span className="subtitle">Handpicked For You</span>
            <h2 className="title">Featured Products</h2>
          </div>
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : featured.length === 0 ? (
            <p className="text-center text-muted">No products found.</p>
          ) : (
            <>
              <Swiper
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{ 576: { slidesPerView: 2 }, 992: { slidesPerView: 4 } }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
                className="pb-5"
              >
                {featured.map((p) => (
                  <SwiperSlide key={p.id}>
                    <ProductCard product={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="text-center mt-4">
                <Link to="/shop" className="lab-btn">
                  <span>View All Products</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <WhatWeSell />
      <FaqAccordion />
    </div>
  );
};

export default Home;
