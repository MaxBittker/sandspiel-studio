precision highp float;
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
  vec3 colordata = vec3(0., 0., 0.0);
  if (type == 0) {
    colordata = mix(colors[0], color2s[0], data.g);
  } else if (type == 1) {
    colordata = mix(colors[1], color2s[1], data.g);
  } else if (type == 2) {
    colordata = mix(colors[2], color2s[2], data.g);
  } else if (type == 3) {
    colordata = mix(colors[3], color2s[3], data.g);
  } else if (type == 4) {
    colordata = mix(colors[4], color2s[4], data.g);
  } else if (type == 5) {
    colordata = mix(colors[5], color2s[5], data.g);
  } else if (type == 6) {
    colordata = mix(colors[6], color2s[6], data.g);
  } else if (type == 7) {
    colordata = mix(colors[7], color2s[7], data.g);
  } else if (type == 8) {
    colordata = mix(colors[8], color2s[8], data.g);
  } else if (type == 9) {
    colordata = mix(colors[9], color2s[9], data.g);
  } else if (type == 10) {
    colordata = mix(colors[10], color2s[10], data.g);
  } else if (type == 11) {
    colordata = mix(colors[11], color2s[11], data.g);
  } else if (type == 12) {
    colordata = mix(colors[12], color2s[12], data.g);
  } else if (type == 13) {
    colordata = mix(colors[13], color2s[13], data.g);
  } else if (type == 14) {
    colordata = mix(colors[14], color2s[14], data.g);
  } else if (type == 15) {
    colordata = mix(colors[15], color2s[15], data.g);
  }

  hue = colordata.r;
  saturation = colordata.g;
  lightness = colordata.b;

  // hue = mod(hue + data.g, 1.0);
  // saturation += (data.b * .5);
  // lightness += (data.a *.5);

  vec3 color = hsl2rgb(hue, saturation, lightness);
  gl_FragColor = vec4(color, a);
}