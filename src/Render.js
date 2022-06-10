// import raw from "raw.macro";
import * as reglBuilder from "regl";
import {
  height,
  width,
  initSand,
  sands,
  tick,
  pushUndo,
  popUndo,
} from "./SandApi";
import GIF from "gif.js";

import useStore, { globalState } from "./store";
import fsh from "./sand.glsl";

let vsh = `
// boring "pass-through" vertex shader
precision mediump float;
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(position, 0, 1);
}`;

let startWebGL = ({ canvas, width, height, sands, isSnapshot }) => {
  const regl = reglBuilder({
    canvas,
    attributes: { preserveDrawingBuffer: isSnapshot },
  });

  const dataTexture = regl.texture({ width, height, data: sands });

  let drawSand = regl({
    frag: fsh,
    uniforms: {
      t: ({ tick }) => tick,
      data: () => {
        return dataTexture({ width, height, data: sands });
      },

      "colors[0]": () => useStore.getState().colors[0] ?? [0.5, 0.5, 0.5],
      "colors[1]": () => useStore.getState().colors[1] ?? [0.5, 0.5, 0.5],
      "colors[2]": () => useStore.getState().colors[2] ?? [0.5, 0.5, 0.5],
      "colors[3]": () => useStore.getState().colors[3] ?? [0.5, 0.5, 0.5],
      "colors[4]": () => useStore.getState().colors[4] ?? [0.5, 0.5, 0.5],
      "colors[5]": () => useStore.getState().colors[5] ?? [0.5, 0.5, 0.5],
      "colors[6]": () => useStore.getState().colors[6] ?? [0.5, 0.5, 0.5],
      "colors[7]": () => useStore.getState().colors[7] ?? [0.5, 0.5, 0.5],
      "colors[8]": () => useStore.getState().colors[8] ?? [0.5, 0.5, 0.5],
      "colors[9]": () => useStore.getState().colors[9] ?? [0.5, 0.5, 0.5],
      "colors[10]": () => useStore.getState().colors[10] ?? [0.5, 0.5, 0.5],
      "colors[11]": () => useStore.getState().colors[11] ?? [0.5, 0.5, 0.5],
      "colors[12]": () => useStore.getState().colors[12] ?? [0.5, 0.5, 0.5],
      "colors[13]": () => useStore.getState().colors[13] ?? [0.5, 0.5, 0.5],
      "colors[14]": () => useStore.getState().colors[14] ?? [0.5, 0.5, 0.5],
      "colors[15]": () => useStore.getState().colors[15] ?? [0.5, 0.5, 0.5],
      "colors[16]": () => useStore.getState().colors[16] ?? [0.5, 0.5, 0.5],

      "color2s[0]": () => useStore.getState().color2s[0] ?? [0.5, 0.5, 0.5],
      "color2s[1]": () => useStore.getState().color2s[1] ?? [0.5, 0.5, 0.5],
      "color2s[2]": () => useStore.getState().color2s[2] ?? [0.5, 0.5, 0.5],
      "color2s[3]": () => useStore.getState().color2s[3] ?? [0.5, 0.5, 0.5],
      "color2s[4]": () => useStore.getState().color2s[4] ?? [0.5, 0.5, 0.5],
      "color2s[5]": () => useStore.getState().color2s[5] ?? [0.5, 0.5, 0.5],
      "color2s[6]": () => useStore.getState().color2s[6] ?? [0.5, 0.5, 0.5],
      "color2s[7]": () => useStore.getState().color2s[7] ?? [0.5, 0.5, 0.5],
      "color2s[8]": () => useStore.getState().color2s[8] ?? [0.5, 0.5, 0.5],
      "color2s[9]": () => useStore.getState().color2s[9] ?? [0.5, 0.5, 0.5],
      "color2s[10]": () => useStore.getState().color2s[10] ?? [0.5, 0.5, 0.5],
      "color2s[11]": () => useStore.getState().color2s[11] ?? [0.5, 0.5, 0.5],
      "color2s[12]": () => useStore.getState().color2s[12] ?? [0.5, 0.5, 0.5],
      "color2s[13]": () => useStore.getState().color2s[13] ?? [0.5, 0.5, 0.5],
      "color2s[14]": () => useStore.getState().color2s[14] ?? [0.5, 0.5, 0.5],
      "color2s[15]": () => useStore.getState().color2s[15] ?? [0.5, 0.5, 0.5],
      "color2s[16]": () => useStore.getState().color2s[16] ?? [0.5, 0.5, 0.5],

      dpi: window.devicePixelRatio * 2,
    },

    vert: vsh,
    attributes: {
      // Full screen triangle
      position: [
        [-1, 4],
        [-1, -1],
        [4, -1],
      ],
    },
    // Our triangle has 3 vertices
    count: 3,
  });

  return {
    render: () => {
      regl.poll();
      drawSand();
    },
    regl,
  };
};

let snapshot = () => {
  let canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;
  let { render } = startWebGL({
    canvas,
    width,
    height,
    sands,
    isSnapshot: true,
  });
  render();

  return canvas.toDataURL("image/png");
};

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_e) => resolve(reader.result);
    reader.onerror = (_e) => reject(reader.error);
    reader.onabort = (_e) => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}

export let exportGif = async () => {
  const initialPauseState = useStore.getState().pause;
  useStore.setState({ isPaused: true });

  let canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;
  let w = canvas.width;
  let h = canvas.height;

  var gif = new GIF({
    workers: 2,
    quality: 4,
    workerScript: "/gif.worker.js",
    width: canvas.width,
    height: canvas.height,
  });

  pushUndo();
  const tmpc = document.createElement("canvas");
  tmpc.width = w;
  tmpc.height = h;
  const tctx = tmpc.getContext("2d");
  const tmpc2 = document.createElement("canvas");
  tmpc2.width = w;
  tmpc2.height = h;
  const tctx2 = tmpc2.getContext("2d");
  tctx2.scale(1, -1);
  tctx2.translate(0, -h);
  // this is faster but the y-axis gets flipped
  let { render, regl } = startWebGL({
    canvas,
    width,
    height,
    sands,
    isSnapshot: true,
  });
  let frames = [];
  const numFrames = 8;

  for (var i = 0; i < numFrames; i++) {
    regl.clear({
      color: [1, 1, 1, 1],
      depth: 1,
      stencil: 0,
    });

    render();

    tick();
    let data2 = new ImageData(w, h);
    let pixels = new Uint8Array(data2.data.buffer);
    regl.read(pixels);
    console.log("adding frame " + i);
    tctx.clearRect(0, 0, w, h);
    tctx.putImageData(data2, 0, 0);
    tctx2.clearRect(0, 0, w, h);
    tctx2.drawImage(tmpc, 0, 0, w, h);
    const data = tctx2.getImageData(0, 0, w, h);

    frames.push(data);
  }
  popUndo();
  // boomerang
  frames = [...frames, ...frames.slice(1, -1).reverse()];

  for (var f = 0; f < frames.length; f++) {
    let frame = frames[f];
    let d =
      Math.min(
        Math.abs(f),
        Math.abs(f - (numFrames - 1)),
        Math.abs(f - frames.length)
      ) / frames.length;

    let delay = (1 / (d + 0.15)) * 20;
    // console.log(d.toFixed(2), 1 / (d + 0.1));
    gif.addFrame(frame, { delay });
  }

  let finished = new Promise((resolve, reject) => {
    gif.on("finished", function (blob) {
      // console.log(blob);
      // window.open(URL.createObjectURL(blob));

      useStore.setState({ isPaused: initialPauseState });
      resolve(blobToDataURL(blob));
    });
  });

  gif.render();
  return finished;
};

function pallette() {
  if (typeof window == "undefined") {
    return;
  }
  let canvas = document.createElement("canvas");
  let elements = useStore.getState().elements;
  let range = elements.length;

  // const sands = new Uint8Array(4 * range);

  canvas.width = range;
  canvas.height = 1;

  elements.forEach((_, i) => {
    initSand([i, 0], i);
  });

  canvas.style =
    "position:absolute; z-index:999; right:0; bottom:0; zoom: 10; image-rendering: pixelated;";

  document.body.appendChild(canvas);
  let { render } = startWebGL({
    canvas,
    width: range,
    height: 1,
    isSnapshot: true,
    sands: sands.slice(0, range * 4),
  });
  render();
  let ctx = canvas.getContext("webgl");
  let data = new Uint8Array(range * 4);
  ctx.readPixels(0, 0, range, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, data);
  let colors = elements.map((name, id) => {
    let index = id * 4;
    let color = `rgba(${data[index]},${data[index + 1]}, ${
      data[index + 2]
    }, 0.5)`;
    return color;
  });
  elements.forEach((_, i) => {
    initSand([i, 0], 0);
    initSand([i, 1], 0);
    initSand([i, 2], 0);
  });
  globalState.pallette = colors;
  return colors;
}

export { startWebGL, pallette, snapshot };
