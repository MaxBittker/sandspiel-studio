import React from "react";
import StarAnimation from "./StarAnimation";
import StarIcon from "./StarIcon";

function StarButton({ starred = false, ...rest }) {
  return (
    <button
      className={`StarButton ${starred ? "StarButton--starred" : ""}`}
      type="button"
      {...rest}
    >
      <StarAnimation starred={starred} />
      <StarIcon />
    </button>
  );
}

export default StarButton;
