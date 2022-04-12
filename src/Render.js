import raw from "raw.macro";
import elements from "./elements";
const reglBuilder = require("regl");

const sandShader = raw("./sand.glsl");
let vsh = `
// boring "pass-through" vertex shader
precision mediump float;
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(position, 0, 1);
}`;

let fsh = sandShader;
let startWebGL = ({ canvas, width, height, sands }) => {
  const regl = reglBuilder({
    canvas,
  });
  const dataTexture = regl.texture({ width, height, data: window.sands });

  let drawSand = regl({
    frag: fsh,
    uniforms: {
      t: ({ tick }) => tick,
      data: () => {
        return dataTexture({ width, height, data: sands });
      },

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

function pallette() {
  let canvas = document.createElement("canvas");

  let range = elements.length;

  const sands = new Uint8Array(4 * range);

  canvas.width = range;
  canvas.height = 1;

  elements.forEach((_, i) => {
    let idx = i * 4;
    sands[idx] = i;

    sands[idx + 1] = 50;
    sands[idx + 2] = 50;
    sands[idx + 3] = 0;
  });

  canvas.style =
    "position:absolute; z-index:999; right:0; bottom:0; zoom: 10; image-rendering: pixelated;";

  document.body.appendChild(canvas);
  let render = startWebGL({
    canvas,
    width: range,
    height: 4,
    height: 1,
    isSnapshot: true,
    sands,
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
  return colors;
}

export { startWebGL, pallette };
