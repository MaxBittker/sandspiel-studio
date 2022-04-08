import React, { useEffect, useState, useCallback } from "react";
import useAnimationFrame from "use-animation-frame";
import { startWebGL } from "./Render";
import useStore from "./store";
import "./game.css";
import ElementButtons from "./ElementButtons";
import elements from "./elements";
import ExtraUI from "./ExtraUI";

const width = 150;
let dpi = 4;
const height = width;
const sands = new Uint8Array(width * height * 4);
window.sands = sands;

let clock = 0;
let aX = 0;
let aY = 0;

function isBlock(pos, value, type) {
  if (type === "Group") {
    for (const [element] of value) {
      if (getSandRelative(pos) === element) return true;
    }
    return false;
  }

  const element = value;
  if (getSandRelative(pos) === element) return true;
  return false;
}

function isTouching([x, y], value, type) {
  const right = [x + 1, y];
  const left = [x - 1, y];
  const up = [x, y - 1];
  const down = [x, y + 1];

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
  if (aX + sx < 0 || aX + sx >= width || aY + sy < 0 || aY + sy >= height) {
    return;
  }
  if (aX + bx < 0 || aX + bx >= width || aY + by < 0 || aY + by >= height) {
    return;
  }

  let aid = getIndexRelative(sx, sy);
  let bid = getIndexRelative(bx, by);

  let a = sands[aid];
  let ara = sands[aid + 1];
  let arb = sands[aid + 2];

  let b = sands[bid];
  let bra = sands[bid + 1];
  let brb = sands[bid + 2];

  sands[aid] = b;
  sands[aid + 1] = bra;
  sands[aid + 2] = brb;
  sands[aid + 3] = clock;

  sands[bid] = a;
  sands[bid + 1] = ara;
  sands[bid + 2] = arb;
  sands[bid + 3] = clock;
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function add(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax + bx, ay + by];
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a;
    return [x + b, y + b];
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b;
    return [x + a, y + a];
  }
  return a + b;
}

function subtract(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax - bx, ay - by];
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a;
    return [x - b, y - b];
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b;
    return [x - a, y - a];
  }
  return a - b;
}

function multiply(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax * bx, ay * by];
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a;
    return [x * b, y * b];
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b;
    return [x * a, y * a];
  }
  return a * b;
}

function divide(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax / bx, ay / by];
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a;
    return [x / b, y / b];
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b;
    return [x / a, y / a];
  }
  return a / b;
}

const TRANSFORMATION_SETS = {
  ROTATION: [
    (x, y) => [x, y],
    (x, y) => [-y, x],
    (x, y) => [-x, -y],
    (x, y) => [y, -x],
  ],
  REFLECTION: [
    (x, y) => [x, y],
    (x, y) => [-x, y],
    (x, y) => [x, -y],
    (x, y) => [-x, -y],
  ],
  HORIZONTAL_REFLECTION: [(x, y) => [x, y], (x, y) => [-x, y]],
  VERTICAL_REFLECTION: [(x, y) => [x, y], (x, y) => [x, -y]],
};

let transformationSet = "ROTATION";
let transformationId = 0;
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
window.isBlock = isBlock;
window.add = add;
window.clamp = clamp;
window.subtract = subtract;
window.multiply = multiply;
window.divide = divide;
window.setTransformation = setTransformation;
window.setRandomTransformation = setRandomTransformation;
window.getTransformation = getTransformation;

window.updaters = elements.map(() => {
  return () => {};
});

export const UPDATE_SCHEMES = {
  ["ORDERED"]: () => {
    for (var i = 0; i < sands.length; i += 4) {
      fireEvent(i);
    }
  },

  ["REVERSE_ORDERED"]: () => {
    for (var i = sands.length - 4; i >= 0; i -= 4) {
      fireEvent(i);
    }
  },

  ["XFIRST_ORDERED"]: () => {
    fireEventPhase({ xFirst: true });
  },

  ["ALTERNATE_ORDERED"]: {
    direction: true,
    tick: (scheme) => {
      if (scheme.direction) {
        for (var i = 0; i < sands.length; i += 4) {
          fireEvent(i);
        }
      } else {
        for (var i = sands.length - 4; i >= 0; i -= 4) {
          fireEvent(i);
        }
      }

      scheme.direction = !scheme.direction;
    },
  },

  ["X_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [
      {
        aDirection: 1,
        bDirection: 1,
      },
      {
        aDirection: 1,
        bDirection: -1,
      },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["XY_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [
      {
        xFirst: false,
        aDirection: 1,
        bDirection: 1,
      },
      {
        xFirst: false,
        aDirection: -1,
        bDirection: 1,
      },
      {
        xFirst: false,
        aDirection: -1,
        bDirection: -1,
      },
      {
        xFirst: false,
        aDirection: 1,
        bDirection: -1,
      },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["XFIRST_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [
      {
        xFirst: false,
      },
      {
        xFirst: true,
      },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },
};

const fireEventPhase = ({
  xFirst = false,
  aDirection = 1,
  bDirection = 1,
} = {}) => {
  const size = width;
  const aStart = aDirection === 1 ? 0 : size - 1;
  const bStart = bDirection === 1 ? 0 : size - 1;
  const aCond = aDirection === 1 ? (a) => a < size : (a) => a >= 0;
  const bCond = bDirection === 1 ? (b) => b < size : (b) => b >= 0;

  for (let a = aStart; aCond(a); a += aDirection) {
    for (let b = bStart; bCond(b); b += bDirection) {
      const [x, y] = xFirst ? [a, b] : [b, a];
      const index = getIndex(x, y);
      fireEvent(index);
    }
  }
};

const fireEvent = (offset, { tagged = window.taggedMode } = {}) => {
  if (tagged) {
    let c = sands[offset + 3];
    if (c === clock) return;
    sands[offset + 3] = clock;
  }

  let index = offset / 4;
  let e = sands[offset];
  let x = index % width;
  let y = Math.floor(index / width);
  aX = x;
  aY = y;
  window.returnValue = undefined;
  window.updaters[e](e);
};

const tick = () => {
  clock = (clock + 1) % 2;
  const scheme = UPDATE_SCHEMES[window.updateScheme];
  if (typeof scheme === "function") scheme(scheme);
  else scheme.tick(scheme);
};

export const seed = () => {
  for (var i = 0; i < sands.length; i += 4) {
    sands[i] = 0;
    /*if (Math.random() * i > width * height * 3) {
      sands[i] = (Math.random() * (elements.length - 1)) | 0;
    }*/
    sands[i + 1] = (Math.random() * 200) | 0;
    sands[i + 2] = 0;
    sands[i + 3] = 0;
  }
};
seed();

const Sand = () => {
  const selectedElement = useStore((state) => state.selectedElement);
  const updateScheme = useStore((state) => state.updateScheme);
  const taggedMode = useStore((state) => state.taggedMode);
  const setSelected = useStore((state) => state.setSelected);
  const setUpdateScheme = useStore((state) => state.setUpdateScheme);
  const setTaggedMode = useStore((state) => state.setTaggedMode);

  const canvas = React.useRef();
  const drawer = React.useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  React.useEffect(() => {
    drawer.current = startWebGL({
      canvas: canvas.current,
      width,
      height,
      sands,
    });
  });

  useAnimationFrame((e) => {
    tick();
    drawer.current();
  }, []);

  useEffect(() => {
    window.selectedElement = selectedElement;
    window.updateScheme = updateScheme;
    window.taggedMode = taggedMode;
  }, [selectedElement, updateScheme, taggedMode]);

  const [drawerWidth, setWidth] = useState(
    Math.min(window.innerWidth / 2, 400)
  );
  const [isDragging, setIsDragging] = useState(false);
  let mouseMove = useCallback((e) => {
    e.preventDefault();
    let x = window.innerWidth - e.pageX;
    setWidth(x);
  }, []);
  let mouseUp = useCallback(
    (e) => {
      setIsDragging(false);
    },
    [setIsDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [isDragging, mouseMove, mouseUp]);
  return (
    <div id="world" style={{ width: drawerWidth }}>
      <div
        className="resizeHandle"
        onMouseDown={() => {
          setIsDragging(true);
        }}
      ></div>
      <ElementButtons
        selectedElement={selectedElement}
        setSelected={setSelected}
      />
      <canvas
        className="worldCanvas"
        onMouseDown={(e) => {
          let bounds = canvas.current.getBoundingClientRect();
          let eX = Math.round(
            (e.clientX - bounds.left) * (width / bounds.width)
          );
          let eY = Math.round(
            (e.clientY - bounds.top) * (height / bounds.height)
          );

          prevPos = [eX, eY];
          setIsDrawing(true);
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={(e) => {
          if (!isDrawing) {
            return;
          }
          let bounds = canvas.current.getBoundingClientRect();
          let eX = Math.round(
            (e.clientX - bounds.left) * (width / bounds.width)
          );
          let eY = Math.round(
            (e.clientY - bounds.top) * (height / bounds.height)
          );
          let points = pointsAlongLine(prevPos[0], prevPos[1], eX, eY, 1);

          points.forEach(({ x, y }) => {
            x = Math.round(x);
            y = Math.round(y);
            setSand(x, y, selectedElement);
            setSand(x - 1, y, selectedElement);
            setSand(x, y - 1, selectedElement);
            setSand(x, y + 1, selectedElement);
            setSand(x + 1, y, selectedElement);
          });
          prevPos = [eX, eY];
        }}
        ref={canvas}
        height={height * dpi}
        width={width * dpi}
      />
      <ExtraUI
        updateScheme={updateScheme}
        setUpdateScheme={setUpdateScheme}
        taggedMode={taggedMode}
        setTaggedMode={setTaggedMode}
      />
    </div>
  );
};
let prevPos = [0, 0];
function distance(aX, aY, bX, bY) {
  return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
}

function pointsAlongLine(startx, starty, endx, endy, spacing) {
  let dist = distance(startx, starty, endx, endy);
  let steps = dist / spacing;

  let points = [];
  for (var d = 0; d <= 1; d += 1 / steps) {
    let point = {
      x: startx * d + endx * (1 - d),
      y: starty * d + endy * (1 - d),
    };
    points.push(point);
  }
  return points;
}

Sand.propTypes = {};
export default Sand;
