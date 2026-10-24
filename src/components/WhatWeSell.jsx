import React, { useState } from "react";
import { FaTruck, FaUndo, FaHeadset, FaShieldAlt } from "react-icons/fa";

const items = [
  { icon: <FaTruck />, title: "Free Shipping", desc: "On all orders over $50" },
  { icon: <FaUndo />, title: "Free Returns", desc: "7-day easy returns" },
  { icon: <FaHeadset />, title: "24/7 Support", desc: "Dedicated support team" },
  { icon: <FaShieldAlt />, title: "Secure Payment", desc: "100% protected payments" },
];

const WhatWeSell = () => (
  <section className="padding-tb bg-white">
    <div className="container">
      <div className="section-header text-center reveal">
        <span className="subtitle">Our Promise</span>
        <h2 className="title">What We Sell & Why Us</h2>
      </div>
      <div className="row g-4 justify-content-center">
        {items.map((it, i) => (
          <div className="col-lg-3 col-md-6 col-12" key={i}>
            <div className="card h-100 text-center p-4 tw-card-hover reveal">
              <div className="display-6 text-primary mb-2 d-flex justify-content-center">
                {it.icon}
              </div>
              <h5>{it.title}</h5>
              <p className="text-muted mb-0">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatWeSell;
