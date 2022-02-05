precision highp float;
uniform float t;
uniform sampler2D data;

varying vec2 uv;

void main() {
  vec2 textCoord = ((uv * vec2(0.5, -0.5)) + vec2(0.5)).yx;
  vec4 data = texture2D(data, textCoord);

  vec3 color = vec3(data.r, data.r, data.r);
  gl_FragColor = vec4(color, a);
}