import React, { useState } from "react";
import PropTypes from "prop-types";
import useAnimationFrame from "use-animation-frame";
import { startWebGL } from "./Render";

const width = 300;
const height = width;
const sands = new Uint8Array(width * height * 4);
window.sands = sands;

let aX = 0;
let aY = 0;
function getIndex(x, y) {
  return (x + y * width) * 4;
}
function getSand(x, y) {
  return sands[getIndex(x, y)];
}
function setSand(x, y, v) {
  sands[getIndex(x, y)] = v;
}
function getSandRelative(x, y) {
  return getSand(x + aX, y + aY);
}
function setSandRelative(x, y, v) {
  sands[getIndex(x + aX, y + aY)] = v;
}
window.getSandRelative = getSandRelative;
window.setSandRelative = setSandRelative;

window.sandUpdate = (e) => {
  let u = getSandRelative(0, 1);
  if (u > e) {
    setSandRelative(0, 1, e);
    setSandRelative(0, 0, u);
  } else {
    let d = Math.random() > 0.5 ? -1 : 1;
    let ud = getSandRelative(d, 1);
    if (ud > e) {
      setSandRelative(0, 0, ud);
      setSandRelative(d, 1, e);
    }
  }
};
const tick = () => {
  for (var i = 0; i < sands.length; i += 4) {
    let index = i / 4;
    let e = sands[i];
    let x = index % width;
    let y = Math.floor(index / width);
    aX = x;
    aY = y;
    if (e === 1) {
      window.sandUpdate(e);
    }
  }
};

let elements = ["Air", "Water", "Sand", "Omega"];

const seed = () => {
  for (var i = 0; i < sands.length; i += 4) {
    sands[i] = (Math.random() * (elements.length - 1)) | 0;
    sands[i + 1] = (Math.random() * 255) | 0;
    sands[i + 2] = 0;
    sands[i + 3] = 0;
  }
};
seed();
const ElementButton = ({ i, setElement, selected }) => {
  return (
    <button
      className={selected ? "selected" : ""}
      onClick={() => setElement(i)}
    >
      {elements[i]}
    </button>
  );
};
const UI = ({ selectedElement, setSelected }) => {
  return (
    <div className="element-tray">
      {elements.map((e, i) => {
        return (
          <ElementButton
            key={i}
            i={i}
            setElement={setSelected}
            selected={i === selectedElement}
          />
        );
      })}
      <br></br>
      <button
        onClick={() => {
          seed();
        }}
      >
        Reset
      </button>
    </div>
  );
};
const Sand = () => {
  const [selectedElement, setSelected] = useState(1);

  const canvas = React.useRef();
  const drawer = React.useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  React.useEffect(() => {
    drawer.current = startWebGL({ canvas: canvas.current, width, height });
  });
  useAnimationFrame((e) => {
    tick();
    drawer.current();
  }, []);

  return (
    <>
      <UI selectedElement={selectedElement} setSelected={setSelected} />

      <canvas
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={(e) => {
          if (isDrawing) {
            let bounds = canvas.current.getBoundingClientRect();
            let eX = Math.round(e.clientX - bounds.left);
            let eY = height - Math.round(e.clientY - bounds.top);
            setSand(eX, eY, selectedElement);
          }
        }}
        ref={canvas}
        height={height}
        width={width}
      />
    </>
  );
};
Sand.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};
export default Sand;
