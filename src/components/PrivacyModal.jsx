import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const PrivacyModal = () => {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState("privacy");
  return (
    <>
      <div className="d-flex gap-3 justify-content-center mt-3">
        <Button variant="link" size="sm" onClick={() => { setTab("privacy"); setShow(true); }}>
          Privacy Policy
        </Button>
        <Button variant="link" size="sm" onClick={() => { setTab("terms"); setShow(true); }}>
          Terms & Conditions
        </Button>
      </div>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{tab === "privacy" ? "Privacy Policy" : "Terms & Conditions"}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {tab === "privacy" ? (
            <>
              <p>We respect your privacy. Your cart, wishlist and account data are stored locally in your browser and never shared without consent.</p>
              <p>Newsletter emails can be unsubscribed anytime. Contact info@shopcart.com for data deletion requests.</p>
            </>
          ) : (
            <>
              <p>By using ShopCart you agree to fair use, accurate information at checkout, and our 7-day return policy.</p>
              <p>Discounts and offers cannot be combined unless stated. Disputes are subject to standard consumer protection laws.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PrivacyModal;
