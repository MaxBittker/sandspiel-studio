import raw from "raw.macro";
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
let startWebGL = ({ canvas, width, height }) => {
  const regl = reglBuilder({
    canvas,
  });
  const dataTexture = regl.texture({ width, height, data: window.sands });

  let drawSand = regl({
    frag: fsh,
    uniforms: {
      t: ({ tick }) => tick,
      data: () => {
        return dataTexture({ width, height, data: window.sands });
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

export { startWebGL };
