import React, { useState } from "react";

const faqs = [
  { q: "How do I track my order?", a: "Go to Cart > Checkout. You will receive tracking details on your registered email after placing the order." },
  { q: "What is the return policy?", a: "7-day free returns on unused items in original packaging. Refunds are issued to the original payment method." },
  { q: "Do you offer Cash on Delivery?", a: "Yes, COD is available on eligible pin codes along with UPI, cards and net-banking." },
  { q: "How do I add products to Wishlist?", a: "Click the heart icon on any product card. Open the Wishlist page from the header to manage saved items." },
];

const FaqAccordion = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="padding-tb aside-bg">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="section-header text-center">
          <span className="subtitle">Help</span>
          <h2 className="title">Frequently Asked Questions</h2>
        </div>
        <div className="faq-acc">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={i}>
                <h2 className="faq-header">
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-chevron" aria-hidden="true">
                      <i className="icofont-rounded-down"></i>
                    </span>
                  </button>
                </h2>
                <div
                  className="faq-a-wrap"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                >
                  <div className="faq-a">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
