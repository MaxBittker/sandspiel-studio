import { UPDATE_SCHEMES } from "./updateSchemes";
import { globalState, useStore } from "./store.js";
import { ChebyshevRotate } from "./Chebyshev.js";
import noise from "./perlin";
import { shuffle } from "lodash";
noise.seed(Math.random());

let aX = 0;
let aY = 0;
let transformationSet = "ROTATION";
let transformationId = 0;

export let width = 150;
export let height = width;
export let cellCount = width * height;
export let sands = new Uint8Array(cellCount * 4);
let undoStack = [];
let afterFrameStatements = [];

pushUndo();
export function pushUndo() {
  undoStack.push(sands.slice(0, cellCount * 4));
  if (undoStack.length > 45) {
    undoStack.shift();
  }
}
export function popUndo() {
  let undo = undoStack.pop();
  sands.set(undo);
  if (undoStack.length === 0) {
    pushUndo();
  }
}
let inertMode = false;
globalState.t = 0;
function randomData(x, y) {
  var value = noise.simplex3(x / 3, y / 3, globalState.t / 5);
  let d = ((value + 1) * 50) | 0;

  return d;
}
if (typeof window !== "undefined") {
  window.sands = sands;
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function turn(v, direction = -1) {
  return ChebyshevRotate(v, direction);
}

function resolveValueToNumber(value) {
  if (value === undefined) return undefined;
  if (typeof value === "number") return value;
  const [head] = value;
  if (typeof head === "number") return resolveVectorToNumber(value);
  return resolveGroupToNumber(value);
}

function resolveVectorToNumber(vector) {
  const message = `Unimplemented code - please tell @TodePond or @maxbittker that you found this error :)`;
  alert(message);
  throw new Error(message);
}

function resolveGroupToNumber(group) {
  if (group.length === 1) {
    const [value] = group[0];
    return value;
  }

  const index = Math.floor(Math.random() * group.length);
  const [value] = group[index];
  return value;
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

function getNumberTouching([x, y], value, type) {
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
    let number = 0;
    for (const [element] of value) {
      if (getSandRelative(right) === element) number++;
      if (getSandRelative(left) === element) number++;
      if (getSandRelative(up) === element) number++;
      if (getSandRelative(down) === element) number++;
      if (getSandRelative(upRight) === element) number++;
      if (getSandRelative(upleft) === element) number++;
      if (getSandRelative(downRight) === element) number++;
      if (getSandRelative(downLeft) === element) number++;
    }
    return number;
  }

  let number = 0;
  const element = value;
  if (getSandRelative(right) === element) number++;
  if (getSandRelative(left) === element) number++;
  if (getSandRelative(up) === element) number++;
  if (getSandRelative(down) === element) number++;
  if (getSandRelative(upRight) === element) number++;
  if (getSandRelative(upleft) === element) number++;
  if (getSandRelative(downRight) === element) number++;
  if (getSandRelative(downLeft) === element) number++;
  return number;
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
    return 1; // wall
  }
  return sands[getIndex(x, y) + o];
}
export function initSand([x, y], v) {
  setSand(x, y, v, randomData(x, y), 0, 0);
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
function setSandRelative([x, y], v, ra, rb, rc, reset = true) {
  // Transformation
  [x, y] = [x, y].map((value) => Math.round(value));
  const transform = TRANSFORMATION_SETS[transformationSet][transformationId];
  [x, y] = transform(x, y);

  // Implicitly cast values to numbers
  [v, ra, rb, rc] = [v, ra, rb, rc].map((value) => resolveValueToNumber(value));

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
    if (reset) {
      ra = ra || randomData(x, y);
      rb = rb || 0;
      rc = rc || 0;
    }
  }
  if (ra !== undefined) sands[i + 1] = ra;
  if (rb !== undefined) sands[i + 2] = (rb + 100) % 100;
  if (rc !== undefined) sands[i + 3] = rc;
}

function cloneSandRelative([sx, sy], [bx, by], swaps) {
  if (inertMode) return;
  [sx, sy] = [sx, sy].map((v) => Math.round(v));
  [bx, by] = [bx, by].map((v) => Math.round(v));
  const transform = TRANSFORMATION_SETS[transformationSet][transformationId];
  let [sxt, syt] = transform(sx, sy);
  let [bxt, byt] = transform(bx, by);
  if (aX + sxt < 0 || aX + sxt >= width || aY + syt < 0 || aY + syt >= height) {
    return;
  }
  if (aX + bxt < 0 || aX + bxt >= width || aY + byt < 0 || aY + byt >= height) {
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

  const transform = TRANSFORMATION_SETS[transformationSet][transformationId];
  let [sxt, syt] = transform(sx, sy);
  let [bxt, byt] = transform(bx, by);
  if (aX + sxt < 0 || aX + sxt >= width || aY + syt < 0 || aY + syt >= height) {
    return;
  }
  if (aX + bxt < 0 || aX + bxt >= width || aY + byt < 0 || aY + byt >= height) {
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

  // swaps.push([aid, bid]);
}

function moveOrigin([x, y]) {
  if (aX + x < 0 || aX + x >= width || aY + y < 0 || aY + y >= height) {
    return;
  }
  [aX, aY] = [aX + x, aY + y];
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

function mod(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax % bx, ay % by];
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a;
    return [x % b, y % b];
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b;
    return [x % a, y % a];
  }
  return a % b;
}

function differenceScalar(a, b) {
  return Math.abs(a - b);
}

// this is half baked, it also doesn't work correctly for hue rotate which wraps
function difference(a, b, aType, bType) {
  if (aType === "Vector" && bType === "Vector") {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [differenceScalar(ax, bx), differenceScalar(ay, by)];
  }
  if (aType === "Vector" && bType !== "Vector") {
    const [x, y] = a;
    return [differenceScalar(x, b), differenceScalar(y, b)];
  }
  if (aType !== "Vector" && bType === "Vector") {
    const [x, y] = b;
    return [differenceScalar(x, a), differenceScalar(y, a)];
  }
  return differenceScalar(a, b);
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
  window.addEventListener(
    "keydown",
    (e) => {
      if (!trackedKeys.has(e.key)) return;
      keys[e.key] = true;
      if (document.activeElement.classList.contains("simulation-button")) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "keyup",
    (e) => {
      if (!trackedKeys.has(e.key)) return;
      keys[e.key] = false;
    },
    { passive: false }
  );

  window.addEventListener("visibilitychange", (e) => {
    resetTrackedKeys();
  });
}
function getKeyBoardVector() {
  let x = 0;
  let y = 0;
  if (keys["ArrowRight"]) {
    x++;
  }
  if (keys["ArrowLeft"]) {
    x--;
  }
  if (keys["ArrowUp"]) {
    y--;
  }
  if (keys["ArrowDown"]) {
    y++;
  }
  return [x, y];
}
function getCursorDistance() {
  let { pos } = useStore.getState();
  return Math.floor(
    Math.sqrt(Math.pow(pos[0] - aX, 2) + Math.pow(pos[1] - aY, 2))
  );
}

function callAfterFrame(func) {
  const statement = { aX, aY, transformationSet, transformationId, func };
  afterFrameStatements.push(statement);
}

globalState.keys = keys;
globalState.getKeyBoardVector = getKeyBoardVector;
globalState.getCursorDistance = getCursorDistance;
globalState.getSandRelative = getSandRelative;
globalState.setSandRelative = setSandRelative;
globalState.swapSandRelative = swapSandRelative;
globalState.cloneSandRelative = cloneSandRelative;
globalState.moveOrigin = moveOrigin;
globalState.eq = eq;
globalState.greaterThan = greaterThan;
globalState.lessThan = lessThan;
globalState.isTouching = isTouching;
globalState.getNumberTouching = getNumberTouching;
globalState.isBlock = isBlock;
globalState.add = add;
globalState.clamp = clamp;
globalState.subtract = subtract;
globalState.multiply = multiply;
globalState.difference = difference;
globalState.divide = divide;
globalState.mod = mod;
globalState.setTransformation = setTransformation;
globalState.randomOffset = randomOffset;
globalState.setRotation = setRotation;
globalState.setRandomTransformation = setRandomTransformation;
globalState.loopThroughTransformation = loopThroughTransformation;
globalState.getTransformation = getTransformation;
globalState.callAfterFrame = callAfterFrame;

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
  transformationSet = "ROTATION";
  transformationId = 0;
  const behaveFunction = globalState.updaters[e];
  if (behaveFunction === undefined) return [];
  // console.log(behaveFunction.toString());
  behaveFunction();
};

export const tick = () => {
  globalState.t++;
  const scheme = UPDATE_SCHEMES[globalState.updateScheme || "RANDOM_CYCLIC"];
  if (typeof scheme === "function") scheme(scheme);
  else scheme.tick(scheme);

  for (const statement of afterFrameStatements) {
    aX = statement.aX;
    aY = statement.aY;
    transformationSet = statement.transformationSet;
    transformationId = statement.transformationId;
    statement.func();
  }

  afterFrameStatements.length = 0;
};

export const reset = () => {
  const data = useStore.getState().initialSandsData;
  if (data === undefined) {
    return seed();
  }

  for (var i = 0; i < width * height * 4; i++) {
    sands[i] = data[i];
  }
};

export const seed = () => {
  for (var i = 0; i < sands.length; i += 4) {
    let x = (i / 4) % width;
    let y = Math.floor(i / 4 / width);

    sands[i] = 0;
    sands[i + 1] = randomData(x, y);
    sands[i + 2] = 0;
    sands[i + 3] = 0;
  }
};
seed();
