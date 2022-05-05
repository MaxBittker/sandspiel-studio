import React from "react";
// import { pallette } from "./Render";
import elements from "./elements";
import { globalState } from "./store";

// let pallette_data = pallette();

const ElementButton = ({ i, setSelected, selected }) => {
  let [h, s, l] = globalState.colors[i] ?? [0, 0.5, 0.5];
  let color = `hsla(${h * 360},${s * 100}%,${l * 100}%,0.5)`;

  return (
    <button
      className={selected ? "simulation-button selected" : "simulation-button"}
      onClick={() => {
        document.querySelector(".blocklyMainBackground").style.fill =
          color.replace("0.5", "0.3");
        setSelected(i);
      }}
      style={{
        backgroundColor: selected ? color.replace("0.5", "1.5") : color,
      }}
    >
      {elements[i]}
    </button>
  );
};

const ElementButtons = ({ selectedElement, setSelected }) => {
  return (
    <div className="element-tray">
      {elements.map((e, i) => {
        return (
          <ElementButton
            key={i}
            i={i}
            setSelected={setSelected}
            selected={i === selectedElement}
          />
        );
      })}
    </div>
  );
};
export default ElementButtons;
