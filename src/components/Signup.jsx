import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dummySignup, isEmailRegistered } from "../redux/slices/authSlice";
import { validateEmail } from "../utils/format";
import Toast from "./Toast";
import "../components/Login.css";

const Signup = () => {
  const [form, setForm] = useState({
    username: "xyz",
    email: "xyz@gmail.com",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    else if (form.username.trim().length < 3)
      errs.username = "Username must be at least 3 characters";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!validateEmail(form.email)) errs.email = "Enter a valid email address";
    else if (isEmailRegistered(form.email))
      errs.email = "This email is already registered. Please log in.";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 4)
      errs.password = "Password must be at least 4 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    dispatch(
      dummySignup({
        username: form.username.trim(),
        email: form.email,
        password: form.password,
      })
    );
    setToast({ show: true, message: "Account created successfully" });
    setTimeout(() => navigate("/", { replace: true }), 1300);
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
          <div className="account-wrapper auth-card" style={{ maxWidth: 520, margin: "0 auto" }}>
            <span className="auth-badge">New here</span>
            <h3 className="title">Create Account</h3>
            <p className="text-muted small auth-sub">
              Pick your username and password — you will be signed in instantly.
            </p>
            <form className="account-form" onSubmit={handleSignup} noValidate autoComplete="off">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username *"
                  value={form.username}
                  onChange={onChange}
                  aria-invalid={!!errors.username}
                  aria-label="Username"
                  autoComplete="username"
                />
                {errors.username && <small className="text-danger">{errors.username}</small>}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={onChange}
                  aria-invalid={!!errors.email}
                  aria-label="Email address"
                  autoComplete="email"
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
                  autoComplete="new-password"
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirm Password *"
                  value={form.confirm}
                  onChange={onChange}
                  aria-invalid={!!errors.confirm}
                  aria-label="Confirm password"
                  autoComplete="new-password"
                />
                {errors.confirm && <small className="text-danger">{errors.confirm}</small>}
              </div>
              <div className="form-group text-center">
                <button className="d-block lab-btn auth-submit" type="submit">
                  <span>Sign Up</span>
                </button>
              </div>
            </form>
            <p className="small mt-3 mb-0">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
