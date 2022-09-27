import React from "react";
import Dropdown from "react-dropdown";
import {
  seedNewWorldSize,
  width,
  height,
  seedWithBorder,
} from "../simulation/SandApi.js";
let worldScaleMap = [1 / 4, 1 / 2, 1];
let worldScaleNameMap = ["small", "big", "MEGA"];
import { globalState, useStore } from "../store";

const WorldSizeButtons = ({}) => {
  const worldWidth = useStore((state) => state.worldWidth);
  const setWorldSize = useStore((state) => state.setWorldSize);
  const setWorldScale = useStore((state) => state.setWorldScale);
  const worldScale = useStore((state) => state.worldScale);
  const choiceId = worldScaleMap.indexOf(worldScale);
  const choiceName = worldScaleNameMap[choiceId];

  return (
    <span className="worldSizes">
      <pre>World Size</pre>
      <Dropdown
        options={worldScaleNameMap.map((label, value) => ({ value, label }))}
        onChange={(e) => {
          const oldSize = worldWidth;
          const newScale = worldScaleMap[e.value];
          const newSize = Math.round(newScale * width);
          setWorldSize([newSize, newSize]);
          globalState.worldWidth = newSize;
          globalState.worldHeight = newSize;

          seedNewWorldSize(oldSize, newSize);
          setWorldScale(newScale);
        }}
        value={choiceName}
      />
    </span>
  );
};

export default WorldSizeButtons;
export { worldScaleMap };
