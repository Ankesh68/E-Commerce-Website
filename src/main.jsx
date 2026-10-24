import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "swiper/css";

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// fonts and icons
import "././assets/css/icofont.min.css";
import "././assets/css/animate.css";
import "././assets/css/style.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./home/Home.jsx";
import Shop from "./Shop/Shop.jsx";
import SingleProduct from "./Shop/SingleProduct.jsx";
import CartPage from "./Shop/CartPage.jsx";
import CheckoutPage from "./Shop/CheckoutPage.jsx";
import About from "./About/About.jsx";
import Contact from "./ContactPage/Contact.jsx";
import AuthProvider from "./Contexts/AuthProvider.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import PrivateRoute from "../src/PrivateRoute/PrivateRoute.jsx"
import Wishlist from "./Wishlist/Wishlist.jsx";




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "/", element: <Home /> },

      {
        path: "/Shop",
        element: <Shop/>
      },
      {
        path: "shop/:id",
        element : <SingleProduct/>
      },
      {
        path: "/cart-page",
        element : <PrivateRoute><CartPage/></PrivateRoute>
      }, 
      {
        path: "/About",
        element: <About/>
      },
      {
        path: "/contact",
        element:  <Contact/>
      },
      {
         path: "/wishlist-page",
        element: <Wishlist/>
      },


    ],
    
  },
  {
    path: "/check-out",
    element: <CheckoutPage/>
  },
  {
    path : "/login",
    element : <Login/>
  },
  {
    path : "/signup",
    element : <Signup/>
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);
