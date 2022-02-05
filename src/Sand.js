import React from "react";
import PropTypes from "prop-types";
import useAnimationFrame from "use-animation-frame";
import { startWebGL } from "./Render";

const width = 300;
const height = width;
const sands = new Uint8Array(width * height * 4);
window.sands = sands;
function getIndex(x, y) {
  return (x + y * width) * 4;
}
function getSand(x, y) {
  return sands[getIndex(x, y)];
}
function setSand(x, y, v) {
  sands[getIndex(x, y)] = v;
}
const tick = () => {
  sands.forEach((e, i, array) => {
    if (i % 4 !== 0) return;
    let index = i / 4;
    let x = index % width;
    let y = Math.floor(index / width);
    let u = getSand(x, y + 1);
    if (u < e) {
      setSand(x, y + 1, e);
      setSand(x, y, u);
    } else {
      let d = Math.random() > 0.5 ? -1 : 1;
      let ud = getSand(x + d, y + 1);
      if (ud < e) {
        setSand(x + d, y + 1, e);
        setSand(x, y, ud);
      }
    }
  });
};

const seed = () => {
  sands.forEach((element, index, array) => {
    sands[index] = (Math.random() * 8) | 0;
  });
};
seed();

const Sand = ({}) => {
  const canvas = React.useRef();
  const drawer = React.useRef();
  React.useEffect(() => {
    drawer.current = startWebGL({ canvas: canvas.current, width, height });
  });
  useAnimationFrame((e) => {
    tick();
    drawer.current();
  }, []);

  return <canvas ref={canvas} height={height} width={width} />;
};
Sand.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};
export default Sand;
