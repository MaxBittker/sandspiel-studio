import React from "react";
import { seedNewWorldSize, width, height } from "./SandApi.js";
let worldSizeMap = [1 / 3, 1 / 2, 1];
import { useStore } from "./store";

const WorldSizeButtons = ({}) => {
  const worldWidth = useStore((state) => state.worldWidth);
  const setWorldSize = useStore((state) => state.setWorldSize);

  return (
    <span className="worldSizes">
      {worldSizeMap.map((v, i) => (
        <button
          key={i}
          className={v * width == worldWidth ? "selected" : ""}
          onClick={(e) => {
            const oldSize = worldWidth;
            const newSize = Math.round(v * width);
            setWorldSize([newSize, newSize]);
            seedNewWorldSize(oldSize, newSize);
          }}
          style={{
            padding: "0px",
            marginRight: i === 0 ? 0 : -1,
            marginRight: i === worldSizeMap.length - 1 ? 2 : 0,
            borderTopRightRadius: i < worldSizeMap.length - 1 ? 0 : "",
            borderBottomRightRadius: i < worldSizeMap.length - 1 ? 0 : "",
            borderTopLeftRadius: i > 0 ? 0 : "",
            borderBottomLeftRadius: i > 0 ? 0 : "",
            marginTop: "10px",
          }}
        >
          <svg height="23" width="23" id="d" viewBox="0 0 100 100">
            <rect
              x={100 / 2 - (30 * (i + 1)) / 2}
              y={100 / 2 - (30 * (i + 1)) / 2}
              width={30 * (i + 1)}
              height={30 * (i + 1)}
            />
          </svg>
        </button>
      ))}
    </span>
  );
};

export default WorldSizeButtons;
export { worldSizeMap };
