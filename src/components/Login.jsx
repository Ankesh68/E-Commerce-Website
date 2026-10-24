import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dummyLogin } from "../redux/slices/authSlice";
import { validateLogin } from "../utils/format";
import Toast from "./Toast";
import "../components/Login.css";

const title = "Welcome Back";

const Login = () => {
  const [form, setForm] = useState({
    email: "xyz@gmail.com",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Dummy login: koi bhi password chalega, no backend check
    dispatch(dummyLogin({ email: form.email }));
    setToast({ show: true, message: "Successfully logged in" });
    setTimeout(() => navigate(from, { replace: true }), 1200);
  };

  return (
    <div>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
      <div className="login-section auth-hero padding-tb section-bg">
        <div className="container">
          <div className="account-wrapper auth-card" style={{ maxWidth: 480, margin: "0 auto" }}>
            <span className="auth-badge">Secure login</span>
            <h3 className="title">{title}</h3>
            <p className="text-muted small auth-sub">
              Use the prefilled email and enter any password to log in.
            </p>
            <form className="account-form" onSubmit={handleLogin} noValidate>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={onChange}
                  aria-invalid={!!errors.email}
                  aria-label="Email address"
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password *"
                  value={form.password}
                  onChange={onChange}
                  aria-invalid={!!errors.password}
                  aria-label="Password"
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>
              <div className="form-group text-center">
                <button className="d-block lab-btn auth-submit" type="submit">
                  <span>Log In</span>
                </button>
              </div>
            </form>
            <p className="small mt-3 mb-0">
              New to ShopCart? <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
