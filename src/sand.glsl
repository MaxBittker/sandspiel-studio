precision highp float;
uniform float t;
uniform sampler2D data;

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
  int type = int((data.r * 255.) + 0.1);
  float hue = 0.0;
  float saturation = 0.3;
  float lightness = 0.25 + data.g * 0.2;
float a = 1.0;
  if (type == 0) {
    lightness = 1.0;
    //  a = 0.;
  } else if (type == 1) {
    hue = 0.65;
    saturation = 0.7;
    lightness += 0.3;

  } else if (type == 2) {
    hue = 0.15;
    saturation = 0.7;
    lightness += 0.3;

  } else if (type == 3) {
    hue = 0.15;
    lightness -= .2;

  } else if (type == 4) {
    hue = 0.4;
    saturation = 0.5;

  } else if (type == 5) {
    hue = 0.15;
    saturation = 0.0;
    lightness += .2;

  } else if (type == 6) {
    hue = .8;
    saturation *= 1.5;

  } else if (type == 7) {
    hue = data.g * 0.1;
    saturation *= 1.5;
    lightness += .2;
  } else if (type == 8) { // ICE
    hue = 0.6;
    saturation = 0.4;
    lightness = 0.6 + data.g * 0.1;

  } else if (type == 9) { // Gas

    hue = (data.g * 0.1);
    lightness = 0.7 + data.g * 0.25;
  } else if (type == 10) { // MITE

    hue = 0.8;
    saturation = 0.9;
    lightness = 0.6 + data.g * 0.1;
  } else if (type == 11) { // Wood

    hue = -0.4 + (data.g * 0.5);
    saturation = 0.1;
  } else if (type == 12) { // Fungus
    hue = (data.g * 0.15) - 0.1;
    saturation = (data.g * 0.8) - 0.05;

    // (data.g * 0.00);
    lightness = 1.0 - (data.g * 0.2);
  } else if (type == 13) { // seed

  
    saturation = 0.2 + (data.g + 0.1);
    lightness = 0.7 + (data.g * 0.1);

    if (data.b < 0.1) { // seed
        hue = 0.9;
    }    else if (data.b > 0.6) {
        hue = 0.4;
        saturation -= 0.2;
        lightness -= 0.4;
    }  else {
        hue = fract(fract(data.g * 41.) * 0.5) - 0.3;
        saturation += 0.2;
        lightness -= 0.3;
       lightness += (data.b - 0.1) * .8;
    }
  } else if (type == 14) { // lava
    hue = (data.g * 0.1);
    lightness = 0.4 + data.g * 0.25;
  } else if (type == 15) { // acid

    lightness = 1.5 - (data.g * 0.2);
    hue = 0.18;
    saturation = 0.9;
    lightness = 0.6 + data.g * 0.2;
  } else if (type == 16) { // dust
    hue = (data.g * 2.0) + t * .0008;
    saturation = 0.7;
    lightness = 0.7;
  } else if (type == 17) { // OIL
    hue = (data.g * 5.0) + t * .008;
    saturation = 0.2;
    lightness = 0.3;

  } else if (type == 18) { // Rocket
  }
  vec3 color = hsl2rgb(hue, saturation, lightness);
  gl_FragColor = vec4(color, a);
}