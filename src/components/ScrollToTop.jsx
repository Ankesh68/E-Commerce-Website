import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll to top on every route change (pathname or query).
// Renders nothing. Must sit inside the Router (see App.jsx).
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
