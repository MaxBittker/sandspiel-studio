import { UPDATE_SCHEMES } from "./updateSchemes";
// import elements from "./elements";

let clock = 0;
let aX = 0;
let aY = 0;
export const width = 150;
export const height = width;
export const cellCount = width * height;

export const sands = new Uint8Array(cellCount * 4);
window.sands = sands;
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

  const upRight = [x + 1, y - 1];
  const upleft = [x - 1, y - 1];
  const downRight = [x + 1, y + 1];
  const downLeft = [x - 1, y + 1];

  if (type === "Group") {
    for (const [element] of value) {
      if (getSandRelative(right) === element) return true;
      if (getSandRelative(left) === element) return true;
      if (getSandRelative(up) === element) return true;
      if (getSandRelative(down) === element) return true;
      if (getSandRelative(upRight) === element) return true;
      if (getSandRelative(upleft) === element) return true;
      if (getSandRelative(downRight) === element) return true;
      if (getSandRelative(downLeft) === element) return true;
    }
    return false;
  }

  const element = value;
  if (getSandRelative(right) === element) return true;
  if (getSandRelative(left) === element) return true;
  if (getSandRelative(up) === element) return true;
  if (getSandRelative(down) === element) return true;
  if (getSandRelative(upRight) === element) return true;
  if (getSandRelative(upleft) === element) return true;
  if (getSandRelative(downRight) === element) return true;
  if (getSandRelative(downLeft) === element) return true;
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
export function setSand(x, y, v, ra, rb) {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }

  let i = getIndex(x, y);
  if (sands[i] !== 0 && v > 0) {
    return;
  }
  if (v !== undefined) sands[i] = v;
  if (ra !== undefined) sands[i + 1] = ra;
  if (rb !== undefined) sands[i + 2] = rb;

  if (!UPDATE_SCHEMES[window.updateScheme].manualTagging) {
    sands[i + 3] = clock;
  }
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
  [x, y] = [x, y].map((v) => Math.round(v));
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
  /*if (!UPDATE_SCHEMES[window.updateScheme].manualTagging) {
    sands[i + 3] = clock;
  }*/
}

function swapSandRelative([sx, sy], [bx, by], swaps) {
  [sx, sy] = [sx, sy].map((v) => Math.round(v));
  [bx, by] = [bx, by].map((v) => Math.round(v));
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

  sands[bid] = a;
  sands[bid + 1] = ara;
  sands[bid + 2] = arb;

  if (!UPDATE_SCHEMES[window.updateScheme].manualTagging) {
    sands[aid + 3] = clock;
    sands[bid + 3] = clock;
  }

  swaps.push([aid, bid]);
}

function moveOrigin([x, y]) {
  if (aX + x < 0 || aX + x >= width || aY + y < 0 || aY + y >= height) {
    return;
  }
  [aX, aY] = [aX + x, aY + y];
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
function rotate([x, y], [ox, oy], angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dy = y - oy;
  const dx = x - ox;
  const nx = dx * cos + dy * sin + ox;
  const ny = dy * cos - dx * sin + oy;
  return [nx, ny];
}

function turn([x, y], direction = -1) {
  return rotate([x, y], [0, 0], (direction * Math.PI) / 4);
}

function add(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax + bx, ay + by];
  }
  if (aType === "Vector" && bType !== "Vector") {
    let [x, y] = a;
    for (let i = 0; i < b; i++) {
      [x, y] = turn([x, y], -1);
    }
    return [x, y];
  }
  if (aType !== "Vector" && bType === "Vector") {
    let [x, y] = b;
    for (let i = 0; i < a; i++) {
      [x, y] = turn([x, y], -1);
    }
    return [x, y];
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
    let [x, y] = a;
    for (let i = 0; i < b; i++) {
      [x, y] = turn([x, y], 1);
    }
    return [x, y];
  }
  if (aType !== "Vector" && bType === "Vector") {
    let [x, y] = b;
    for (let i = 0; i < a; i++) {
      [x, y] = turn([x, y], 1);
    }
    return [x, y];
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

function loopThroughTransformation(set, func) {
  transformationSet = set;
  const transformFuncs = TRANSFORMATION_SETS[transformationSet];
  for (let i = 0; i < transformFuncs.length; i++) {
    transformationId = i;
    func();
  }
}

function getTransformation() {
  return [transformationSet, transformationId];
}
function randomOffset() {
  let options = [
    [0, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
    [1, -1],
    [-1, -1],
    [1, 1],
    [-1, 1],
  ];
  return options[Math.floor(Math.random() * options.length)];
}

const trackedKeys = new Set([
  " ",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
]);

const keys = {};
function resetTrackedKeys() {
  for (const key of trackedKeys.values()) {
    keys[key] = false;
  }
}

resetTrackedKeys();

window.addEventListener("keydown", (e) => {
  if (!trackedKeys.has(e.key)) return;
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  if (!trackedKeys.has(e.key)) return;
  keys[e.key] = false;
});

window.addEventListener("visibilitychange", (e) => {
  resetTrackedKeys();
});

window.keys = keys;
window.getSandRelative = getSandRelative;
window.setSandRelative = setSandRelative;
window.swapSandRelative = swapSandRelative;
window.moveOrigin = moveOrigin;
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
window.randomOffset = randomOffset;
window.setRandomTransformation = setRandomTransformation;
window.loopThroughTransformation = loopThroughTransformation;
window.getTransformation = getTransformation;
export const fireEventPhase = ({
  xFirst = false,
  aDirection = 1,
  bDirection = 1,
  snake = false,
} = {}) => {
  const size = width;
  const aStart = aDirection === 1 ? 0 : size - 1;
  const bStart = bDirection === 1 ? 0 : size - 1;
  const bSnakeStart = bDirection === -1 ? 0 : size - 1;

  const aCond = aDirection === 1 ? (a) => a < size : (a) => a >= 0;
  const bCond = bDirection === 1 ? (b) => b < size : (b) => b >= 0;
  const bSnakeCond = bDirection === -1 ? (b) => b < size : (b) => b >= 0;

  let bIsSnaking = false;

  for (let a = aStart; aCond(a); a += aDirection) {
    if (!bIsSnaking) {
      for (let b = bStart; bCond(b); b += bDirection) {
        const [x, y] = xFirst ? [a, b] : [b, a];
        const index = getIndex(x, y);
        fireEvent(index);
      }
    } else {
      for (let b = bSnakeStart; bSnakeCond(b); b -= bDirection) {
        const [x, y] = xFirst ? [a, b] : [b, a];
        const index = getIndex(x, y);
        fireEvent(index);
      }
    }

    if (snake) {
      bIsSnaking = !bIsSnaking;
    }
  }
};

export const fireEvent = (offset, { tagged = window.taggedMode } = {}) => {
  if (tagged) {
    let c = sands[offset + 3];
    if (c === clock) return;
    //sands[offset + 3] = clock;
  }

  let index = offset / 4;
  let e = sands[offset];
  let x = index % width;
  let y = Math.floor(index / width);
  aX = x;
  aY = y;
  window.returnValue = undefined;
  const behaveFunction = window.updaters[e];
  if (behaveFunction === undefined) return [];
  const swaps = behaveFunction(e);
  return swaps;
};

export const tick = () => {
  clock = (clock + 1) % 2;
  const scheme = UPDATE_SCHEMES[window.updateScheme || "RANDOM_CYCLIC"];
  if (typeof scheme === "function") scheme(scheme);
  else scheme.tick(scheme);
};

export const seed = () => {
  for (var i = 0; i < sands.length; i += 4) {
    sands[i] = 0;
    // if (Math.random() * i > width * height * 3) {
    //   sands[i] = (Math.random() * (elements.length - 1)) | 0;
    // }
    sands[i + 1] = (Math.random() * 200) | 0;
    sands[i + 2] = 100;
    sands[i + 3] = 0;
  }
};
seed();
