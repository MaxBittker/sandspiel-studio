import React, { useEffect, useState } from "react";
import useAnimationFrame from "use-animation-frame";
import { startWebGL } from "./Render";
import useStore from "./store";

const width = 150;
let dpi = 4;
const height = width;
const sands = new Uint8Array(width * height * 4);
window.sands = sands;

let clock = 0;
let aX = 0;
let aY = 0;
let meX = 0;
let meY = 0;

function isTypeNumberlike(type) {
  return type === "Number" || type === "Boolean" || type === "Element"
}

function eq(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a
    const [bx, by] = b
    return ax === bx && ay === by
  }
  return a === b
}

function greaterThan(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a
    const [bx, by] = b
    return ax > bx && ay > by
  }
  return a > b
}

function lessThan(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a
    const [bx, by] = b
    return ax < bx && ay < by
  }
  return a < b
}

function getIndex(x, y) {
  return (x + y * width) * 4;
}
function getSand(x, y, o = 0) {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return 3; // wall?
  }
  return sands[getIndex(x, y) + 0];
}
function setSand(x, y, v) {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }
  sands[getIndex(x, y)] = v;
}
function getSandRelative([x, y]) {
  return getSand(x + aX, y + aY);
}
function setSandRelative([x, y], v) {
  x = x + aX;
  y = y + aY;
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }
  let i = getIndex(x, y);

  sands[i] = v;
  sands[i + 3] = clock;
}
function getSandRegisterRelative(x, y) {
  return getSand(x + aX, y + aY, 2);
}
function setSandRegisterRelative(x, y, v) {
  x = x + aX;
  y = y + aY;
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }
  let i = getIndex(x, y) + 2;

  sands[i] = v;
  sands[i + 3] = clock;
}

function swapSandRelative([sx, sy], [bx, by]) {
  if (aX+sx < 0 || aX+sx >= width || aY+sy < 0 || aY+sy >= height) {
    return;
  }
  if (aX+bx < 0 || aX+bx >= width || aY+by < 0 || aY+by >= height) {
    return;
  }
  let a = getSandRelative([sx, sy]);
  let b = getSandRelative([bx, by]);
  setSandRelative([sx, sy], b);
  setSandRelative([bx, by], a);

  // Update the position of 'me' if we moved it!
  if (sx === meX && sy === meY) {
    meX = bx;
    meY = by;
  } else if (bx === meX && by === meY) {
    meX = sx;
    meY = sy;
  }
}

// TODO: unsure of which way to go with this
function getRelativeToMe([x, y]) {
  return [x, y];
  //return [meX + x, meY + y];
}

window.getRelativeToMe = getRelativeToMe;
window.getSandRelative = getSandRelative;
window.setSandRelative = setSandRelative;
window.swapSandRelative = swapSandRelative;
window.getSandRegisterRelative = getSandRegisterRelative;
window.setSandRegisterRelative = setSandRegisterRelative;
window.eq = eq;
window.greaterThan = greaterThan;
window.lessThan = lessThan;
export let elements = [
  "Air",
  "Water",
  "Sand",
  "Wall",
  "Plant",
  "Stone",
  "Cloner",
  "Fire",
];

window.updaters = elements.map(() => {
  return () => {};
});

const tick = () => {
  clock = (clock + 1) % 2;
  for (var i = 0; i < sands.length; i += 4) {
    let index = i / 4;
    let c = sands[i + 3];
    if (c === clock) continue;
    let e = sands[i];
    let x = index % width;
    let y = Math.floor(index / width);
    aX = x;
    aY = y;
    meX = 0;
    meY = 0;
    window.returnValue = undefined;
    window.updaters[e](e);
  }
};

const seed = () => {
  for (var i = 0; i < sands.length; i += 4) {
    sands[i] = 0;
    /*if (Math.random() * i > width * height * 3) {
      sands[i] = (Math.random() * (elements.length - 1)) | 0;
    }*/
    sands[i + 1] = (Math.random() * 255) | 0;
    sands[i + 2] = 0;
    sands[i + 3] = 0;
  }
};
seed();
const ElementButton = ({ i, setSelected, selected }) => {
  return (
    <button
      className={selected ? "simulation-button selected" : "simulation-button"}
      onClick={() => setSelected(i)}
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
            setSelected={setSelected}
            selected={i === selectedElement}
          />
        );
      })}
      <br></br>
      <button
        className = "simulation-button"
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
  const selectedElement = useStore((state) => state.selectedElement);
  const setSelected = useStore((state) => state.setSelected);

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

  useEffect(() => {
    window.selectedElement = selectedElement;
  }, [selectedElement]);
  return (
    <>
      <UI selectedElement={selectedElement} setSelected={setSelected} />

      <canvas
        className="worldCanvas"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={(e) => {
          if (isDrawing) {
            let bounds = canvas.current.getBoundingClientRect();
            let eX = Math.round(
              (e.clientX - bounds.left) * (width / bounds.width)
            );
            let eY = Math.round(
              (e.clientY - bounds.top) * (height / bounds.height)
            );
            setSand(eX, eY, selectedElement);
            setSand(eX - 1, eY, selectedElement);
            setSand(eX, eY - 1, selectedElement);
            setSand(eX, eY + 1, selectedElement);
            setSand(eX + 1, eY, selectedElement);
          }
        }}
        ref={canvas}
        height={height * dpi}
        width={width * dpi}
      />
    </>
  );
};
Sand.propTypes = {};
export default Sand;
