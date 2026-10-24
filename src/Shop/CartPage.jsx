import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";
import delImgUrl from "../assets/images/shop/del.png";
import CheckoutPage from "./CheckoutPage";
import {
  syncCartFromStorage,
  removeFromCart,
  setQty,
  selectCartSubtotal,
} from "../redux/slices/cartSlice";
import { formatPrice } from "../utils/format";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const orderTotal = cartSubtotal;

  useEffect(() => {
    dispatch(syncCartFromStorage());
    const onUpdate = () => dispatch(syncCartFromStorage());
    window.addEventListener("cartUpdated", onUpdate);
    return () => window.removeEventListener("cartUpdated", onUpdate);
  }, [dispatch]);

  const calculateTotalPrice = (item) =>
    Number(item.price || 0) * (item.quantity || 0);

  if (!cartItems.length) {
    return (
      <div>
        <PageHeader title={"Shop Cart"} curPage={"Cart Page"} />
        <div className="container padding-tb text-center">
          <h4>Your cart is empty</h4>
          <Link to="/Shop" className="lab-btn mt-3">
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={"Shop Cart"} curPage={"Cart Page"} />
      <div className="shop-cart padding-tb">
        <div className="container">
          <div className="section-wrapper">
            <div className="cart-top">
              <table>
                <thead>
                  <tr>
                    <th className="cat-product">Product</th>
                    <th className="cat-price">Price</th>
                    <th className="cat-quantity">Quantity</th>
                    <th className="cat-toprice">Total</th>
                    <th className="cat-edit">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="product-item cat-product">
                        <div className="p-thumb">
                          <Link to={`/shop/${item.id}`}>
                            <img src={item.img || item.image} alt={item.name} />
                          </Link>
                        </div>
                        <div className="p-content">
                          <Link to={`/shop/${item.id}`}>{item.name || item.title}</Link>
                        </div>
                      </td>
                      <td className="cat-price">{formatPrice(item.price)}</td>
                      <td className="cat-quantity">
                        <div className="cart-plus-minus">
                          <div
                            className="dec qtybutton"
                            onClick={() =>
                              dispatch(setQty(item.id, Math.max(1, (item.quantity || 1) - 1)))
                            }
                          >
                            -
                          </div>
                          <input
                            className="cart-plus-minus-box"
                            type="text"
                            value={item.quantity}
                            readOnly
                          />
                          <div
                            className="inc qtybutton"
                            onClick={() => dispatch(setQty(item.id, (item.quantity || 1) + 1))}
                          >
                            +
                          </div>
                        </div>
                      </td>
                      <td className="cat-toprice">{formatPrice(calculateTotalPrice(item))}</td>
                      <td className="cat-edit">
                        <button
                          className="btn btn-link p-0"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          aria-label={`Remove ${item.name}`}
                        >
                          <img src={delImgUrl} alt="remove" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="co-cart-bottom">
              <div className="co-cart-summary">
                <h3>Cart Totals</h3>
                <ul>
                  <li>
                    <span>Cart Subtotal</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </li>
                  <li>
                    <span>Shipping and Handling</span>
                    <span>Free Shipping</span>
                  </li>
                  <li className="co-cart-total">
                    <span>Order Total</span>
                    <span>{formatPrice(orderTotal)}</span>
                  </li>
                </ul>
                <CheckoutPage />
                <Link to="/Shop" className="co-continue-link">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
