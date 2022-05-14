import React, { useEffect, useState, useCallback } from "react";
import useAnimationFrame from "use-animation-frame";
import { startWebGL } from "./Render";
import useStore, { globalState } from "./store";
import { fps } from "./fps";
import ElementButtons from "./ElementButtons";
import ExtraUI from "./ExtraUI";

import { sands, width, height, tick, initSand, getSand } from "./SandApi";
let dpi = 4;

globalState.updaters = useStore.getState().elements.map(() => {
  return (() => {}).bind(globalState);
});
const Sand = () => {
  const selectedElement = useStore((state) => state.selectedElement);
  const updateScheme = useStore((state) => state.updateScheme);
  const taggedMode = useStore((state) => state.taggedMode);
  const setSelected = useStore((state) => state.setSelected);
  const setUpdateScheme = useStore((state) => state.setUpdateScheme);
  const setTaggedMode = useStore((state) => state.setTaggedMode);

  const canvas = React.useRef();
  const drawer = React.useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverPos, setHoverPos] = useState([0, 0]);
  React.useEffect(() => {
    drawer.current = startWebGL({
      canvas: canvas.current,
      width,
      height,
      sands,
    });
  });

  useEffect(() => {
    globalState.updateScheme = updateScheme;
    globalState.taggedMode = taggedMode;
  }, [selectedElement, updateScheme, taggedMode]);

  useAnimationFrame((e) => {
    if (useStore.getState().paused) {
      drawer?.current();
      return;
    }
    const t0 = performance.now();
    tick();
    drawer?.current();
    const t1 = performance.now();
    let d = t1 - t0;
    fps.render(d);
  }, []);

  const [drawerWidth, setWidth] = useState(
    Math.min(window.innerWidth / 2.5, window.innerHeight * 0.6)
  );
  const [isDragging, setIsDragging] = useState(false);
  let mouseMove = useCallback((e) => {
    e.preventDefault();
    let x = window.innerWidth - e.pageX;
    setWidth(x);
  }, []);
  let mouseUp = useCallback(
    (e) => {
      setIsDragging(false);
    },
    [setIsDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [isDragging, mouseMove, mouseUp]);
  let t = getSand(...hoverPos);
  let r = getSand(...hoverPos, 1);
  let g = getSand(...hoverPos, 2);
  let b = getSand(...hoverPos, 3);
  return (
    <div id="world" style={{ width: drawerWidth }}>
      <div
        className="resizeHandle"
        onMouseDown={() => {
          setIsDragging(true);
        }}
      ></div>
      <ElementButtons
        selectedElement={selectedElement}
        setSelected={setSelected}
      />
      <canvas
        id="worldCanvas"
        onMouseDown={(e) => {
          let bounds = canvas.current.getBoundingClientRect();
          let eX = Math.round(
            (e.clientX - bounds.left) * (width / bounds.width)
          );
          let eY = Math.round(
            (e.clientY - bounds.top) * (height / bounds.height)
          );

          prevPos = [eX, eY];
          setIsDrawing(true);
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={(e) => {
          let bounds = canvas.current.getBoundingClientRect();
          let eX = Math.round(
            (e.clientX - bounds.left) * (width / bounds.width)
          );
          let eY = Math.round(
            (e.clientY - bounds.top) * (height / bounds.height)
          );
          setHoverPos([eX, eY]);
          if (!isDrawing) {
            return;
          }

          let points = pointsAlongLine(prevPos[0], prevPos[1], eX, eY, 1);
          points.forEach(({ x, y }) => {
            x = Math.round(x);
            y = Math.round(y);
            initSand([x, y], selectedElement);
            initSand([x - 1, y], selectedElement);
            initSand([x, y - 1], selectedElement);
            initSand([x, y + 1], selectedElement);
            initSand([x + 1, y], selectedElement);
          });
          prevPos = [eX, eY];
        }}
        ref={canvas}
        height={height * dpi}
        width={width * dpi}
      />
      {`${hoverPos[0]}, ${hoverPos[1]}: ${t} ${r} ${g} ${b}`}
      <ExtraUI
        updateScheme={updateScheme}
        setUpdateScheme={setUpdateScheme}
        taggedMode={taggedMode}
        setTaggedMode={setTaggedMode}
      />
    </div>
  );
};
let prevPos = [0, 0];
function distance(aX, aY, bX, bY) {
  return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
}

function pointsAlongLine(startx, starty, endx, endy, spacing) {
  let dist = distance(startx, starty, endx, endy);
  let steps = dist / spacing;

  let points = [];
  for (var d = 0; d <= 1; d += 1 / steps) {
    let point = {
      x: startx * d + endx * (1 - d),
      y: starty * d + endy * (1 - d),
    };
    points.push(point);
  }
  return points;
}

Sand.propTypes = {};
export default Sand;
