import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Stars = ({ value = 0, count = 0 }) => {
  const v = Number(value) || 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (v >= i) stars.push(<FaStar key={i} />);
    else if (v >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return (
    <span className="rating inline-flex items-center gap-0.5 text-amber-500" aria-label={`Rated ${v} out of 5`}>
      {stars}
      {typeof count !== "undefined" && count !== null && (
        <span className="text-muted ms-1 text-xs">({count})</span>
      )}
    </span>
  );
};

export default Stars;
