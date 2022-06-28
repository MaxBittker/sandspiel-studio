import React, { useEffect, useState, useCallback } from "react";
import useAnimationFrame from "use-animation-frame";
import { startWebGL } from "./Render";
import useStore, { globalState } from "./store";
import { fps } from "./fps";
import { WrappedElementButtons } from "./ElementButtons";
import ExtraUI from "./ExtraUI";

import { sands, width, height, tick, initSand, pushUndo } from "./SandApi";
import { pointsAlongLine } from "./utils";
let dpi = 4;

globalState.updaters = useStore.getState().elements.map(() => {
  return (() => {}).bind(globalState);
});
let holdInterval = null;
let prevPos = [0, 0];

const Sand = () => {
  let starterWidth = Math.min(
    window.innerWidth / 2.5,
    window.innerHeight * 0.6
  );
  let mobile = false;
  if (window.innerWidth < 900) {
    starterWidth = window.innerWidth;
    mobile = true;
  }
  const selectedElement = useStore((state) => state.selectedElement);
  const updateScheme = useStore((state) => state.updateScheme);
  const taggedMode = useStore((state) => state.taggedMode);
  const setSelected = useStore((state) => state.setSelected);
  const setUpdateScheme = useStore((state) => state.setUpdateScheme);
  const setTaggedMode = useStore((state) => state.setTaggedMode);

  const canvas = React.useRef();
  const drawer = React.useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  React.useEffect(() => {
    drawer.current = startWebGL({
      canvas: canvas.current,
      width,
      height,
      sands,
    }).render;
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

  const [drawerWidth, setWidth] = useState(starterWidth);
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

  let mouseMoveCanvas = useCallback(
    (e, force = false) => {
      let bounds = canvas.current.getBoundingClientRect();
      let eX = Math.round((e.clientX - bounds.left) * (width / bounds.width));
      let eY = Math.round((e.clientY - bounds.top) * (height / bounds.height));
      let { size, setPos } = useStore.getState();
      setPos([eX, eY]);
      if (!isDrawing && !force) {
        return;
      }
      let points = pointsAlongLine(prevPos[0], prevPos[1], eX, eY, 1);
      points.forEach(({ x, y }) => {
        x = Math.round(x);
        y = Math.round(y);
        let r = size / 2;
        for (let dx = -r; dx <= r; dx += 1) {
          for (let dy = -r; dy <= r; dy += 1) {
            let rr = dx * dx + dy * dy;
            if (rr > r * r) {
              continue;
            }
            initSand([Math.floor(x + dx), Math.floor(y + dy)], selectedElement);
          }
        }
      });
      prevPos = [eX, eY];
      clearInterval(holdInterval);
      holdInterval = setInterval(() => {
        mouseMoveCanvas(e, true);
      }, 60);
    },
    [isDrawing, selectedElement]
  );

  return (
    <div id="world" style={{ width: drawerWidth }}>
      <div
        className="resizeHandle"
        onMouseDown={() => {
          setIsDragging(true);
        }}
      ></div>
      <WrappedElementButtons
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
          pushUndo();
          setIsDrawing(true);
          clearInterval(holdInterval);
          holdInterval = setInterval(() => {
            mouseMoveCanvas(e, true);
          }, 60);
          mouseMoveCanvas(e, true);
        }}
        onMouseUp={() => {
          clearInterval(holdInterval);
          setIsDrawing(false);
        }}
        onMouseOut={() => {
          clearInterval(holdInterval);
          setIsDrawing(false);
          let { setPos } = useStore.getState();
          setPos([-1, -1]);
        }}
        onMouseMove={mouseMoveCanvas}
        onTouchStart={(e) => {
          let touches = Array.from(e.touches);
          if (touches.length < 1) {
            return;
          }
          let touch = touches[0];

          let bounds = canvas.current.getBoundingClientRect();
          let eX = Math.round(
            (touch.clientX - bounds.left) * (width / bounds.width)
          );
          let eY = Math.round(
            (touch.clientY - bounds.top) * (height / bounds.height)
          );
          pushUndo();
          clearInterval(holdInterval);
          e.clientX = touch.clientX;
          e.clientY = touch.clientY;
          holdInterval = setInterval(() => {
            mouseMoveCanvas(e, true);
          }, 60);
          prevPos = [eX, eY];
        }}
        onTouchEnd={() => {
          clearInterval(holdInterval);
        }}
        onTouchMove={(e) => {
          let touches = Array.from(e.touches);
          if (touches.length !== 1) {
            return;
          }
          e.preventDefault();

          let touch = touches[0];
          e.clientX = touch.clientX;
          e.clientY = touch.clientY;
          setIsDrawing(true);
          mouseMoveCanvas(e);
          clearInterval(holdInterval);
          holdInterval = setInterval(() => {
            mouseMoveCanvas(e, true);
          }, 60);
        }}
        ref={canvas}
        height={height * dpi}
        width={width * dpi}
      />

      <ExtraUI
        updateScheme={updateScheme}
        setUpdateScheme={setUpdateScheme}
        taggedMode={taggedMode}
        setTaggedMode={setTaggedMode}
      />
      {mobile && <h2> &nbsp; To edit elements, use a bigger screen!</h2>}
    </div>
  );
};

Sand.propTypes = {};
export default Sand;
