import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import GoogleMap from "../components/GoogleMap";
import { validateContact } from "../utils/format";
import "./Contact.css";
import contactIcon1 from "../assets/images/icon/01.png";
import contactIcon2 from "../assets/images/icon/02.png";
import contactIcon3 from "../assets/images/icon/03.png";
import contactIcon4 from "../assets/images/icon/04.png";

const subTitle = "Get in touch with us";
const title = "We're Always Eager To Hear From You!";
const conSubTitle = "Get in touch with Contact us";
const conTitle =
  "Fill The Form Below So We Can Get To Know You And Your Needs Better.";
const btnText = "Send your Message";

const contactList = [
  {
    imgUrl: contactIcon1,
    imgAlt: "contact icon",
    title: "Office Address",
    desc: "1201 park street, Fifth Avenue",
  },
  {
    imgUrl: contactIcon2,
    imgAlt: "contact icon",
    title: "Phone number",
    desc: "+22698 745 632,02 982 745",
  },
  {
    imgUrl: contactIcon3,
    imgAlt: "contact icon",
    title: "Send email",
    desc: "admin@shopcart.com",
  },
  {
    imgUrl: contactIcon4,
    imgAlt: "contact icon",
    title: "Our website",
    desc: "www.shopcart.com",
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const FIELD_ERRORS = {
  name: "contact-name-error",
  email: "contact-email-error",
  phone: "contact-phone-error",
  subject: "contact-subject-error",
  message: "contact-message-error",
};

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    setSent(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateContact(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setSent(false);
      return;
    }

    setForm(INITIAL_FORM);
    setSent(true);
  };

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? FIELD_ERRORS[name] : undefined,
    className: errors[name] ? "is-invalid" : "",
  });

  return (
    <div>
      <PageHeader title={"Get In Touch With Us"} curPage={"Contact Us"} />
      <div className="map-address-section padding-tb section-bg">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{subTitle}</span>
            <h2 className="title">{title}</h2>
          </div>
          <div className="section-wrapper">
            <div className="row flex-row-reverse">
              <div className="col-xl-4 col-lg-5 col-12">
                <div className="contact-wrapper">
                  {contactList.map((val, i) => (
                    <div className="contact-item" key={i}>
                      <div className="contact-thumb">
                        <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                      </div>
                      <div className="contact-content">
                        <h6 className="title">{val.title}</h6>
                        <p>{val.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-xl-8 col-lg-7 col-12">
                <GoogleMap />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-section padding-tb">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">{conSubTitle}</span>
            <h2 className="title">{conTitle}</h2>
          </div>
          <div className="section-wrapper">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name *"
                  autoComplete="name"
                  {...fieldProps("name")}
                />
                {errors.name && (
                  <small id={FIELD_ERRORS.name} className="field-error">
                    {errors.name}
                  </small>
                )}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email *"
                  autoComplete="email"
                  {...fieldProps("email")}
                />
                {errors.email && (
                  <small id={FIELD_ERRORS.email} className="field-error">
                    {errors.email}
                  </small>
                )}
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  autoComplete="tel"
                  {...fieldProps("phone")}
                />
                {errors.phone && (
                  <small id={FIELD_ERRORS.phone} className="field-error">
                    {errors.phone}
                  </small>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Subject *"
                  {...fieldProps("subject")}
                />
                {errors.subject && (
                  <small id={FIELD_ERRORS.subject} className="field-error">
                    {errors.subject}
                  </small>
                )}
              </div>
              <div className="form-group w-100">
                <textarea
                  rows="8"
                  placeholder="Your Message *"
                  {...fieldProps("message")}
                ></textarea>
                {errors.message && (
                  <small id={FIELD_ERRORS.message} className="field-error">
                    {errors.message}
                  </small>
                )}
              </div>
              {sent && (
                <div className="contact-success" role="status">
                  Thanks! Your message has been received. We will get back to
                  you soon.
                </div>
              )}
              <div className="form-group w-100 text-center">
                <button type="submit" className="lab-btn">
                  <span>{btnText}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
