import { UPDATE_SCHEMES } from "./updateSchemes";
import { globalState } from "./store.js";
import { ChebyshevRotate } from "./Chebyshev.js";
let aX = 0;
let aY = 0;

export let width = 150;
export let height = width;
export let cellCount = width * height;
export let sands = new Uint8Array(cellCount * 4);

let inertMode = false;
function randomData() {
  return (Math.random() * 100) | 0;
}
if (typeof window !== "undefined") {
  window.sands = sands;
}

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
  if (inertMode) return false;
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

export function getSand(x, y, o = 0) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return 1; // wall
  }
  return sands[getIndex(x, y) + o];
}
export function initSand([x, y], v) {
  setSand(x, y, v, randomData(), 0, 0);
}
export function setSand(x, y, v, ra, rb, rc) {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }

  let i = getIndex(x, y);
  if (v !== undefined) sands[i] = v;
  if (ra !== undefined) sands[i + 1] = ra;
  if (rb !== undefined) sands[i + 2] = rb;
  if (rc !== undefined) sands[i + 3] = rc;
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
function setSandRelative([x, y], v, ra, rb, rc) {
  [x, y] = [x, y].map((v) => Math.round(v));
  const transform = TRANSFORMATION_SETS[transformationSet][transformationId];
  [x, y] = transform(x, y);

  x = x + aX;
  y = y + aY;
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }
  if (inertMode && x !== 0 && y !== 0) return;

  let i = getIndex(x, y);
  if (v !== undefined) {
    if (sands[i] == v) return; // bail to not  reset ra/rb/rc on no-ops
    sands[i] = v;
    ra = ra || randomData();
    rb = rb || 0;
    rc = rc || 0;
  }
  if (ra !== undefined) sands[i + 1] = ra;
  if (rb !== undefined) sands[i + 2] = rb;
  if (rc !== undefined) sands[i + 3] = rc;
}

function cloneSandRelative([sx, sy], [bx, by], swaps) {
  if (inertMode) return;
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

  sands[bid] = sands[aid];
  sands[bid + 1] = sands[aid + 1];
  sands[bid + 2] = sands[aid + 2];
  sands[bid + 3] = sands[aid + 3];
}

function swapSandRelative([sx, sy], [bx, by], swaps) {
  if (inertMode) return;
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
  let arc = sands[aid + 3];

  let b = sands[bid];
  let bra = sands[bid + 1];
  let brb = sands[bid + 2];
  let brc = sands[bid + 3];

  sands[aid] = b;
  sands[aid + 1] = bra;
  sands[aid + 2] = brb;
  sands[aid + 3] = brc;

  sands[bid] = a;
  sands[bid + 1] = ara;
  sands[bid + 2] = arb;
  sands[bid + 3] = arc;

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

function turn(v, direction = -1) {
  return ChebyshevRotate(v, direction);
}

function add(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax + bx, ay + by];
  }
  if (aType === "Vector" && bType !== "Vector") {
    let [x, y] = a;
    [x, y] = turn([x, y], -b);
    return [x, y];
  }
  if (aType !== "Vector" && bType === "Vector") {
    let [x, y] = b;
    [x, y] = turn([x, y], -a);
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
    (x, y) => ChebyshevRotate([x, y], 1),
    (x, y) => ChebyshevRotate([x, y], 2),
    (x, y) => ChebyshevRotate([x, y], 3),
    (x, y) => ChebyshevRotate([x, y], 4),
    (x, y) => ChebyshevRotate([x, y], 5),
    (x, y) => ChebyshevRotate([x, y], 6),
    (x, y) => ChebyshevRotate([x, y], 7),
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

function setRotation(n) {
  transformationSet = "ROTATION";
  transformationId = (n + 800) % 8;
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
if (typeof window !== "undefined") {
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
}

globalState.keys = keys;
globalState.getSandRelative = getSandRelative;
globalState.setSandRelative = setSandRelative;
globalState.swapSandRelative = swapSandRelative;
globalState.cloneSandRelative = cloneSandRelative;
globalState.moveOrigin = moveOrigin;
globalState.eq = eq;
globalState.greaterThan = greaterThan;
globalState.lessThan = lessThan;
globalState.isTouching = isTouching;
globalState.isBlock = isBlock;
globalState.add = add;
globalState.clamp = clamp;
globalState.subtract = subtract;
globalState.multiply = multiply;
globalState.divide = divide;
globalState.setTransformation = setTransformation;
globalState.randomOffset = randomOffset;
globalState.setRotation = setRotation;
globalState.setRandomTransformation = setRandomTransformation;
globalState.loopThroughTransformation = loopThroughTransformation;
globalState.getTransformation = getTransformation;

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

export const fireEvent = (offset) => {
  let index = offset / 4;
  let e = sands[offset];
  let x = index % width;
  let y = Math.floor(index / width);
  aX = x;
  aY = y;
  globalState.returnValue = undefined;
  inertMode = false;
  const behaveFunction = globalState.updaters[e];
  if (behaveFunction === undefined) return [];
  // console.log(behaveFunction.toString());
  behaveFunction();
};

export const tick = () => {
  const scheme = UPDATE_SCHEMES[globalState.updateScheme || "RANDOM_CYCLIC"];
  if (typeof scheme === "function") scheme(scheme);
  else scheme.tick(scheme);
};

export const seed = () => {
  for (var i = 0; i < sands.length; i += 4) {
    sands[i] = 0;

    sands[i + 1] = randomData();
    sands[i + 2] = 0;
    sands[i + 3] = 0;
  }
};
seed();
