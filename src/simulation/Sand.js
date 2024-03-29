import React, { useEffect, useState, useCallback } from "react";
import useAnimationFrame from "use-animation-frame";
import useSound from "use-sound";
import { startWebGL } from "./Render";
import useStore, { globalState } from "../store";
import { fps } from "./fps";
import { WrappedElementButtons } from "../simulation-controls/ElementButtons";
import ExtraUI from "../simulation-controls/ExtraUI";

import {
  useQueryParams,
  StringParam,
  withDefault,
  BooleanParam,
} from "next-query-params";

import { sands, width, height, tick, initSand, pushUndo } from "./SandApi";
import { pointsAlongLine } from "../utils/utils";
import LoadingCurtain from "../pages/loadingCurtain.js";
let dpi = 4;

globalState.updaters = useStore.getState().elements.map(() => {
  return (() => {}).bind(globalState);
});
let holdInterval = null;
let prevPos = [0, 0];
let sI = 0;
const Sand = () => {
  const [query, setQuery] = useQueryParams({
    edit: withDefault(BooleanParam, false),
  });
  const playMode = !query.edit;

  let starterWidth = 700;
  let mobile = false;
  const resize = () => {
    starterWidth = Math.min(window.innerWidth / 2, window.innerHeight * 0.6);
    mobile = false;
    if (window.innerWidth <= 700) {
      starterWidth = window.innerWidth - 6;
      mobile = true;
    }
  };
  resize();

  const [play] = useSound("/media/clave1.wav", {
    volume: 0.15,
  });

  // const [play2] = useSound("/media/clave1.wav", {
  //   volume: 0.01,
  // });
  const [play2] = useSound("/media/clave1.wav", {
    volume: 0.05,
  });
  const selectedElement = useStore((state) => state.selectedElement);
  const updateScheme = useStore((state) => state.updateScheme);
  const taggedMode = useStore((state) => state.taggedMode);
  const setSelected = useStore((state) => state.setSelected);
  const setUpdateScheme = useStore((state) => state.setUpdateScheme);
  const setTaggedMode = useStore((state) => state.setTaggedMode);

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("bench")) {
    globalState.updateScheme = "BENCHMARK";
  }

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
    tick(drawer);
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
      clearInterval(holdInterval);
      setIsDrawing(false);
    },
    [setIsDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", mouseMove);
    }
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      resize();
      setWidth(starterWidth);
    });
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  let mouseMoveCanvas = useCallback(
    (e, force = false) => {
      let bounds = canvas.current.getBoundingClientRect();
      const { worldWidth, worldHeight } = useStore.getState();
      const cellWidth = (bounds.width - 6) / worldWidth;
      const cellHeight = (bounds.height - 6) / worldHeight;
      let eX = Math.floor((e.clientX - 3 - bounds.left) / cellWidth);
      let eY = Math.floor((e.clientY - 3 - bounds.top) / cellHeight);
      let { size, setPos } = useStore.getState();
      setPos([eX, eY]);
      if (!isDrawing && !force) {
        return;
      }
      let points = pointsAlongLine(prevPos[0], prevPos[1], eX, eY, 1);
      globalState.tNoise += 0.05;

      points.forEach(({ x, y }, i) => {
        if (i == 0 && (sI % 4 == 0 || force)) {
          play2({
            playbackRate:
              (0.7 + selectedElement / 10 + Math.sin((x + y) / 10) * 0.5) /
              ((size + 5) / 5),
          });
        }

        let r = size / 2;
        for (let dx = -r; dx <= r; dx += 1) {
          for (let dy = -r; dy <= r; dy += 1) {
            let rr = dx * dx + dy * dy;
            if (rr > r * r) {
              continue;
            }
            initSand(
              [Math.floor(x + dx), Math.floor(y + dy)],
              selectedElement,
              [dx * 4, dy * 4]
            );
          }
        }
      });
      sI++;

      prevPos = [eX, eY];
      clearInterval(holdInterval);
      holdInterval = setInterval(() => {
        mouseMoveCanvas(e, true);
      }, 60);
    },
    [isDrawing, selectedElement]
  );

  return (
    <div id="world" style={{ width: playMode ? starterWidth : drawerWidth }}>
      <LoadingCurtain />
      <div
        className="resizeHandle"
        style={{
          display: playMode ? "none" : "",
        }}
        onMouseDown={() => {
          setIsDragging(true);
        }}
      ></div>
      {
        <button
          className="editor-toggle"
          style={{
            position: "absolute",
            left: -8,
            zIndex: 9000,
            transform: "translateX(-100%)",
          }}
          onClick={(e) => {
            play();
            setQuery({ edit: playMode ? 1 : undefined });
          }}
        >
          {playMode ? "<-  Open Editor " : "-> Close Editor"}
        </button>
      }
      <WrappedElementButtons
        selectedElement={selectedElement}
        setSelected={setSelected}
      />
      <canvas
        id="worldCanvas"
        onMouseDown={(e) => {
          let bounds = canvas.current.getBoundingClientRect();
          const { worldWidth, worldHeight } = useStore.getState();
          const cellWidth = (bounds.width - 6) / worldWidth;
          const cellHeight = (bounds.height - 6) / worldHeight;
          let eX = Math.floor((e.clientX - 3 - bounds.left) / cellWidth);
          let eY = Math.floor((e.clientY - 3 - bounds.top) / cellHeight);

          prevPos = [eX, eY];
          pushUndo();
          setIsDrawing(true);
          clearInterval(holdInterval);
          holdInterval = setInterval(() => {
            mouseMoveCanvas(e, true);
          }, 60);
          mouseMoveCanvas(e, true);
        }}
        onMouseOut={() => {
          clearInterval(holdInterval);
          // setIsDrawing(false);
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
          const { worldWidth, worldHeight } = useStore.getState();
          const cellWidth = (bounds.width - 6) / worldWidth;
          const cellHeight = (bounds.height - 6) / worldHeight;
          let eX = Math.floor((e.clientX - 3 - bounds.left) / cellWidth);
          let eY = Math.floor((e.clientY - 3 - bounds.top) / cellHeight);
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
        playMode={playMode}
        updateScheme={updateScheme}
        setUpdateScheme={setUpdateScheme}
        taggedMode={taggedMode}
        setTaggedMode={setTaggedMode}
      />
      {!playMode && mobile && (
        <h2> &nbsp; To edit elements, use a bigger screen!</h2>
      )}
    </div>
  );
};

Sand.propTypes = {};
export default Sand;
