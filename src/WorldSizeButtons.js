import React from "react";
import { seedNewWorldSize, width, height, seedWithBorder } from "./SandApi.js";
let worldScaleMap = [1 / 4, 1 / 2, 1];
import { globalState, useStore } from "./store";

const WorldSizeButtons = ({}) => {
  const worldWidth = useStore((state) => state.worldWidth);
  const setWorldSize = useStore((state) => state.setWorldSize);
  const setWorldScale = useStore((state) => state.setWorldScale);

  return (
    <span className="worldSizes">
      {worldScaleMap.map((v, i) => (
        <button
          key={i}
          className={v * width == worldWidth ? "selected" : ""}
          onClick={(e) => {
            const oldSize = worldWidth;
            const newSize = Math.round(v * width);
            if (newSize === oldSize) return;

            // Store world size in two places for performance reasons
            setWorldSize([newSize, newSize]);
            globalState.worldWidth = newSize;
            globalState.worldHeight = newSize;

            seedNewWorldSize(oldSize, newSize);
            setWorldScale(v);
            //seedWithBorder();
          }}
          style={{
            padding: "0px",
            marginRight: i === 0 ? 0 : -1,
            marginRight: i === worldScaleMap.length - 1 ? 2 : 0,
            borderTopRightRadius: i < worldScaleMap.length - 1 ? 0 : "",
            borderBottomRightRadius: i < worldScaleMap.length - 1 ? 0 : "",
            borderTopLeftRadius: i > 0 ? 0 : "",
            borderBottomLeftRadius: i > 0 ? 0 : "",
            marginTop: "2px",
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
export { worldScaleMap };
