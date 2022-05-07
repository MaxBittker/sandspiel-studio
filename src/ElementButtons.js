import React, { useState } from "react";
import classNames from "classnames";
// import { pallette } from "./Render";
import { useStore } from "./store";

// let pallette_data = pallette();

const ElementButton = ({ i, setSelected, selected, shrink }) => {
  const elements = useStore((state) => state.elements);
  const colors = useStore((state) => state.colors);
  let [h, s, l] = colors[i] ?? [0, 0.5, 0.5];
  let color = `hsla(${h * 360},${s * 100}%,${l * 100}%,0.5)`;

  return (
    <button
      className={classNames("simulation-button", { selected, shrink })}
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
  const elements = useStore((state) => state.elements);
  let [hovering, setHovering] = useState(null);

  return (
    <div className="element-tray">
      {elements.map((e, i) => {
        return (
          <ElementButton
            key={i}
            i={i}
            setSelected={setSelected}
            selected={i === selectedElement}
            shrink={hovering === "-" && i === elements.length - 1}
          />
        );
      })}

      <span onMouseLeave={() => setHovering(null)}>
        <button
          onMouseEnter={() => setHovering("-")}
          className={"simulation-button element-control"}
          onClick={() => useStore.getState().popXml()}
        >
          -
        </button>

        {elements.length < 15 && (
          <button
            onMouseEnter={() => setHovering("+")}
            className={"simulation-button element-control "}
            onClick={() => useStore.getState().pushXml()}
          >
            +
          </button>
        )}
      </span>

      <div className={"spacer"} />
    </div>
  );
};
export default ElementButtons;
