import React from "react";
let sizeMap = [1.5, 3, 5, 7, 19];
import { useStore } from "./store";

const SizeButtons = ({}) => {
  const size = useStore((state) => state.size);
  const setSize = useStore((state) => state.setSize);

  return (
    <span className="sizes">
      {sizeMap.map((v, i) => (
        <button
          key={i}
          className={v == size ? "selected" : ""}
          onClick={(e) => setSize(v)}
          style={{
            padding: "0px",
            marginRight: i === 0 ? 0 : -1,
            marginRight: i === sizeMap.length - 1 ? 2 : 0,
            borderTopRightRadius: i < sizeMap.length - 1 ? 0 : "",
            borderBottomRightRadius: i < sizeMap.length - 1 ? 0 : "",
            borderTopLeftRadius: i > 0 ? 0 : "",
            borderBottomLeftRadius: i > 0 ? 0 : "",
          }}
        >
          <svg height="23" width="23" id="d" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={3 + v} />
          </svg>
        </button>
      ))}
    </span>
  );
};

export default SizeButtons;
export { sizeMap };
