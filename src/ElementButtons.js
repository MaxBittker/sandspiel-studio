import React from "react";
import { pallette } from "./Render";
import { elements, disabledElements } from "./elements";

let pallette_data = pallette();

const ElementButton = ({ i, setSelected, selected }) => {
  let color = pallette_data[i];

  return (
    <button
      className={selected ? "simulation-button selected" : "simulation-button"}
      onClick={() => {
        document.querySelector(".blocklyMainBackground").style.fill =
          pallette_data[i].replace("0.5", "0.3");
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
        if (disabledElements.indexOf(e) >= 0) {
          return null;
        }
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
