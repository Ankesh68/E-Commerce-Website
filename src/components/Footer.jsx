import React, { useState } from "react";
import { Link } from "react-router-dom";
import PrivacyModal from "./PrivacyModal";
import { validateEmail } from "../utils/format";

const title = "About ShopCart";
const desc = "ShopCart is your one-stop shopping destination: browse categories, search products, save a wishlist and check out with a persistent cart.";
const quickTitle = "Quick Links";

const addressList = [
  { iconName: "icofont-google-map", text: "New York, USA." },
  { iconName: "icofont-phone", text: "+1 123 456 789" },
  { iconName: "icofont-envelope", text: "info@shopcart.com" },
];

const quickList = [
  { text: "Home", link: "/" },
  { text: "Shop", link: "/shop" },
  { text: "Cart", link: "/cart-page" },
  { text: "Wishlist", link: "/wishlist-page" },
  { text: "About", link: "/about" },
  { text: "Contact", link: "/contact" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setMsg("Please enter a valid email address.");
      return;
    }
    const list = JSON.parse(localStorage.getItem("newsletter") || "[]");
    list.push({ email, at: Date.now() });
    localStorage.setItem("newsletter", JSON.stringify(list));
    setMsg("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer className="style-2">
      <div className="footer-top dark-view padding-tb">
        <div className="container">
          <div className="row g-4 row-cols-xl-4 row-cols-sm-2 row-cols-1 justify-content-center">
            <div className="col">
              <div className="footer-item our-address">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title"><h4>{title}</h4></div>
                    <div className="content">
                      <p>{desc}</p>
                      <ul className="lab-ul office-address">
                        {addressList.map((val, i) => (
                          <li key={i}><i className={val.iconName}></i>{val.text}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="footer-item">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title"><h4>{quickTitle}</h4></div>
                    <div className="content">
                      <ul className="lab-ul">
                        {quickList.map((val, i) => (
                          <li key={i}><Link to={val.link}>{val.text}</Link></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="footer-item">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title"><h4>Subscribe Newsletter</h4></div>
                    <form onSubmit={subscribe} className="d-flex gap-2">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email for newsletter"
                      />
                      <button className="lab-btn" type="submit"><span>Join</span></button>
                    </form>
                    {msg && <small className={msg.includes("Thanks") ? "text-success" : "text-danger"}>{msg}</small>}
                    <PrivacyModal />
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="footer-item">
                <div className="footer-inner">
                  <div className="footer-content">
                    <div className="title"><h4>Contact</h4></div>
                    <p className="mb-1">Phone: +1 123 456 789</p>
                    <p className="mb-1">Email: info@shopcart.com</p>
                    <p>Address: New York, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="section-wrapper">
            <p>&copy; 2026 <Link to="/">Shop Cart</Link> Designed by Ankesh Raj</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
