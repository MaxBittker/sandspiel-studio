const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function Cos(a) {
  return clamp(Math.abs(((a + 80) % 8.0) - 4.0) - 2.0, -1.0, 1.0);
}
function Sin(a) {
  return Cos(a - 2.0);
}

function Atan([x, y]) {
  if (y == 0.0) return x > 0.0 ? 0.0 : 4.0;
  let a = x / y;
  if (Math.abs(a) < 1.0) {
    if (y > 0.0) return 2.0 - a;
    else return 6.0 - a;
  } else {
    a = y / x;
    if (x > 0.0) return a + (80 % 8.0);
    else return 4.0 + a;
  }
}
function Length([x, y]) {
  return Math.max(Math.abs(x), Math.abs(y));
}

function CosSin(a) {
  return [Cos(a), Sin(a)];
}

export function ChebyshevRotate([x, y], a) {
  let l = Length([x, y]);
  let p = CosSin(Atan([x, y]) + a);
  return [p[0] * l, p[1] * l];
}
