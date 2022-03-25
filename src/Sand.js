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

function isTouching([x, y], value, type) {
  const right = [x+1, y];
  const left = [x-1, y];
  const up = [x, y-1];
  const down = [x, y+1];

  if (type === "Group") {
    for (const [element] of value) {
      if (getSandRelative(right) === element) return true;
      if (getSandRelative(left) === element) return true;
      if (getSandRelative(up) === element) return true;
      if (getSandRelative(down) === element) return true;
    }
    return false;
  }

  const element = value;
  if (getSandRelative(right) === element) return true;
  if (getSandRelative(left) === element) return true;
  if (getSandRelative(up) === element) return true;
  if (getSandRelative(down) === element) return true;
  return false;
  
}

function eq(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return ax === bx && ay === by;
  }
  if (aType === "Group") {
    return a.some(([value, type]) => eq(value, b, type, bType));
  }
  if (bType === "Group") {
    return b.some(([value, type]) => eq(a, value, aType, type));
  }
  return a === b;
}

function greaterThan(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    const aLength = Math.hypot(ax, ay);
    const bLength = Math.hypot(bx, by);
    return aLength > bLength;
  }
  return a > b;
}

function lessThan(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    const aLength = Math.hypot(ax, ay);
    const bLength = Math.hypot(bx, by);
    return aLength < bLength;
  }
  return a < b;
}

function getIndex(x, y) {
  return (x + y * width) * 4;
}

function getSand(x, y, o = 0) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return 3; // wall?
  }
  return sands[getIndex(x, y) + o];
}
function setSand(x, y, v, ra, rb) {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }

  let i = getIndex(x, y);
  if (v !== undefined) sands[i] = v;
  if (ra !== undefined) sands[i + 1] = ra;
  if (rb !== undefined) sands[i + 2] = rb;
  sands[i + 3] = clock;
}
function getIndexRelative(x, y) {
  const transform = TRANSFORMATION_SETS[transformationSet][transformationId];
  [x, y] = transform(x, y);
  return getIndex(x + aX, y + aY);
}
function getSandRelative([x, y], o = 0) {
  const transform = TRANSFORMATION_SETS[transformationSet][transformationId];
  [x, y] = transform(x, y);
  return getSand(x + aX, y + aY, o);
}
function setSandRelative([x, y], v, ra, rb) {

  const transform = TRANSFORMATION_SETS[transformationSet][transformationId];
  [x, y] = transform(x, y);

  x = x + aX;
  y = y + aY;
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }

  let i = getIndex(x, y);
  if (v !== undefined) sands[i] = v;
  if (ra !== undefined) sands[i + 1] = ra;
  if (rb !== undefined) sands[i + 2] = rb;
  sands[i + 3] = clock;
}

function swapSandRelative([sx, sy], [bx, by]) {

  if (aX+sx < 0 || aX+sx >= width || aY+sy < 0 || aY+sy >= height) {
    return;
  }
  if (aX+bx < 0 || aX+bx >= width || aY+by < 0 || aY+by >= height) {
    return;
  }

  let aid = getIndexRelative(sx, sy);
  let bid = getIndexRelative(bx, by);

  let a = sands[aid];
  let ara = sands[aid+1];
  let arb = sands[aid+2];
  let aclock = sands[aid+3];

  let b = sands[bid];
  let bra = sands[bid+1];
  let brb = sands[bid+2];
  let bclock = sands[bid+3];

  sands[aid] = b;
  sands[aid+1] = bra;
  sands[aid+2] = brb;
  sands[aid+3] = clock;

  sands[bid] = a;
  sands[bid+1] = ara;
  sands[bid+2] = arb;
  sands[bid+3] = clock;

}

function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}

function add(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a
    const [bx, by] = b
    return [ax+bx, ay+by]
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a
    return [x+b, y+b]
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b
    return [x+a, y+a]
  }
  return a + b
}

function subtract(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a
    const [bx, by] = b
    return [ax-bx, ay-by]
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a
    return [x-b, y-b]
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b
    return [x-a, y-a]
  }
  return a - b
}

function multiply(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a
    const [bx, by] = b
    return [ax*bx, ay*by]
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a
    return [x*b, y*b]
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b
    return [x*a, y*a]
  }
  return a * b
}

function divide(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a
    const [bx, by] = b
    return [ax/bx, ay/by]
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a
    return [x/b, y/b]
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b
    return [x/a, y/a]
  }
  return a / b
}

const TRANSFORMATION_SETS = {
  ROTATION: [
    (x, y) => [ x, y],
    (x, y) => [-y, x],
    (x, y) => [-x,-y],
    (x, y) => [ y,-x],
  ],
  REFLECTION: [
    (x, y) => [ x, y],
    (x, y) => [-x, y],
    (x, y) => [ x,-y],
    (x, y) => [-x,-y],
  ],
  HORIZONTAL_REFLECTION: [
    (x, y) => [ x, y],
    (x, y) => [-x, y],
  ],
  VERTICAL_REFLECTION: [
    (x, y) => [ x, y],
    (x, y) => [ x,-y],
  ],
};

let transformationSet = "ROTATION"
let transformationId = 0
function setTransformation(set, id) {
  transformationSet = set;
  transformationId = id;
}

function setRandomTransformation(set) {
  transformationSet = set;
  const funcs = TRANSFORMATION_SETS[transformationSet];
  transformationId = Math.floor(Math.random() * funcs.length);
}

function getTransformation() {
  return [transformationSet, transformationId];
}

window.getSandRelative = getSandRelative;
window.setSandRelative = setSandRelative;
window.swapSandRelative = swapSandRelative;
window.eq = eq;
window.greaterThan = greaterThan;
window.lessThan = lessThan;
window.isTouching = isTouching;
window.add = add;
window.clamp = clamp;
window.subtract = subtract;
window.multiply = multiply;
window.divide = divide;
window.setTransformation = setTransformation;
window.setRandomTransformation = setRandomTransformation;
window.getTransformation = getTransformation;
export let elements = [
  "Air",
  "Water",
  "Sand",
  "Wall",
  "Plant",
  "Stone",
  "Cloner",
  "Fire",
  "Ice",
  "Gas",
  "Mite",
  "Wood",
  "Fungus",
  "Seed",
  "Lava",
  "Acid",
  "Dust",
  "Oil",
  "Rocket",
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
    sands[i + 1] = (Math.random() * 200) | 0;
    sands[i + 2] = (Math.random() * 200) | 0;
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
