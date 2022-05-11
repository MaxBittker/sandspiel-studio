// import raw from "raw.macro";
import * as reglBuilder from "regl";
import { height, width, initSand, sands } from "./SandApi";
import useStore, { globalState } from "./store";
// const sandShader = raw("./sand.glsl");
let vsh = `
// boring "pass-through" vertex shader
precision mediump float;
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(position, 0, 1);
}`;

let fsh = `precision highp float;
uniform float t;
uniform sampler2D data;
uniform vec3 colors[16];
uniform vec3 color2s[16];

varying vec2 uv;

float hue2rgb(float f1, float f2, float hue) {
  if (hue < 0.0)
    hue += 1.0;
  else if (hue > 1.0)
    hue -= 1.0;
  float res;
  if ((6.0 * hue) < 1.0)
    res = f1 + (f2 - f1) * 6.0 * hue;
  else if ((2.0 * hue) < 1.0)
    res = f2;
  else if ((3.0 * hue) < 2.0)
    res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
  else
    res = f1;
  return res;
}

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb;

  if (hsl.y == 0.0) {
    rgb = vec3(hsl.z); // Luminance
  } else {
    float f2;

    if (hsl.z < 0.5)
      f2 = hsl.z * (1.0 + hsl.y);
    else
      f2 = hsl.z + hsl.y - hsl.y * hsl.z;

    float f1 = 2.0 * hsl.z - f2;

    rgb.r = hue2rgb(f1, f2, hsl.x + (1.0 / 3.0));
    rgb.g = hue2rgb(f1, f2, hsl.x);
    rgb.b = hue2rgb(f1, f2, hsl.x - (1.0 / 3.0));
  }
  return rgb;
}

vec3 hsl2rgb(float h, float s, float l) { return hsl2rgb(vec3(h, s, l)); }
void main() {
  vec2 textCoord = ((uv * vec2(0.5, -0.5)) + vec2(0.5));
  vec4 data = texture2D(data, textCoord);
  data.gba = (data.gba * 2.55);
  int type = int((data.r * 255.) + 0.1);
  float hue = 0.0;
  float saturation = 0.3;
  float lightness = 0.8;
  ;

  float a = 1.0;
  vec3 colordata = vec3(0.,0.,0.0);
  if (type == 0) {
    colordata = mix(colors[0],color2s[0],data.b);
  } else if (type == 1) {
    colordata = mix(colors[1],color2s[1],data.b);
  } else if (type == 2) {
    colordata = mix(colors[2],color2s[2],data.b);
  } else if (type == 3) {
    colordata = mix(colors[3],color2s[3],data.b);
  } else if (type == 4) {
    colordata = mix(colors[4],color2s[4],data.b);
  } else if (type == 5) {
    colordata = mix(colors[5],color2s[5],data.b);
  } else if (type == 6) {
    colordata = mix(colors[6],color2s[6],data.b);
  } else if (type == 7) {
    colordata = mix(colors[7],color2s[7],data.b);
  } else if (type == 8) {
    colordata = mix(colors[8],color2s[8],data.b);
  } else if (type == 9) {
    colordata = mix(colors[9],color2s[9],data.b);
  } else if (type == 10) {
    colordata = mix(colors[10],color2s[10],data.b);
  } else if (type == 11) {
    colordata = mix(colors[11],color2s[11],data.b);
  } else if (type == 12) {
    colordata = mix(colors[12],color2s[12],data.b);
  } else if (type == 13) {
    colordata = mix(colors[13],color2s[13],data.b);
  } else if (type == 14) {
    colordata = mix(colors[14],color2s[14],data.b);
  } else if (type == 15) {
    colordata = mix(colors[15],color2s[15],data.b);
  } 


  hue = colordata.r;
    saturation = colordata.g;
    lightness = colordata.b;


    // hue = mod(hue + data.g, 1.0);
    // saturation += (data.b *.5);
    // lightness += (data.a *.5);

  vec3 color = hsl2rgb(hue, saturation, lightness);
  gl_FragColor = vec4(color, a);
}
`;

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
