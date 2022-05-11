// import raw from "raw.macro";
import * as reglBuilder from "regl";
import { height, width, initSand, sands } from "./SandApi";
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

  return () => {
    regl.poll();
    drawSand();
  };
};

let snapshot = () => {
  let canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;
  let render = startWebGL({
    canvas,
    width,
    height,
    sands,
    isSnapshot: true,
  });
  render();

  return canvas.toDataURL("image/png");
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
  let render = startWebGL({
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
