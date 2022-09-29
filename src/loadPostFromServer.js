import { decode } from "fast-png";
import starterXMLs from "./blocks/starterblocks";
import { globalState, MAX_ELEMENTS, useStore } from "./store";
import { width, height, sands, randomData } from "./simulation/SandApi";
import { worldScaleMap } from "./simulation-controls/WorldSizeButtons.js";
import * as Sentry from "@sentry/nextjs";
import BlocklyJS from "blockly/javascript";
import { Xml } from "blockly/core";
import { generateCode } from "./blocks/generator.js";
import { useRef, useState } from "react";
import { getRandomColorName } from "./utils/theme.js";

const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

export async function loadPostFromServer(postId, retrys = 0) {
  let id = postId;
  const idNumber = parseInt(id, 10);

  // Only load the starter elements if no post is getting loaded
  if (isNaN(idNumber) || id.length < 1) {
    useStore.getState().setXmls(starterXMLs);
    useStore.setState({ expandedPostId: null });

    const disabled = [];
    for (let i = 0; i < 4; i++) {
      disabled[i] = false;
    }

    for (let i = 4; i < MAX_ELEMENTS; i++) {
      disabled[i] = true;
    }
    useStore.setState({ disabled });
    loadIntoEditor();
    return;
  }

  const startTime = Date.now();
  const { loading } = useStore.getState();
  if (!loading) {
    useStore.setState({ curtainColor: "purple" /*getRandomColorName() */ });
  }
  useStore.setState({ loading: true });
  useStore.setState({ expandedPostId: idNumber });
  await fetch("/api/getCreation/" + id)
    .then((response) => {
      if (useStore.getState().expandedPostId !== idNumber) {
        return "cancel";
      }
      if (response.status == 200) {
        return response.text();
      } else {
        console.error("I couldnt' find that data: " + id);
        throw "getCreation err";
      }
    })
    .then((raw) => {
      if (raw === "cancel" || useStore.getState().expandedPostId !== idNumber) {
        return "cancel";
      }
      let data = JSON.parse(raw);
      console.log("loaded some code from " + id);
      let { code, metadata, ...post } = data;

      let { xmls } = JSON.parse(code);
      let {
        paused,
        disabled,
        size,
        selectedElement,
        colors,
        color2s,
        elements,
        worldScale = 1 / 2,
      } = JSON.parse(metadata);

      if (!worldScaleMap.includes(worldScale)) {
        worldScale = 1 / 2;
      }

      if (id < 1436) {
        worldScale = 1 / 2;
      }

      const worldWidth = Math.round(worldScale * width);
      const worldHeight = Math.round(worldScale * width);

      // Store world dimensions in two places for performance reasons
      useStore.getState().setWorldSize([worldWidth, worldHeight]);
      globalState.worldWidth = worldWidth;
      globalState.worldHeight = worldHeight;

      useStore.getState().setWorldScale(worldScale);
      useStore.setState({
        initialWorldSize: worldWidth,
        initialWorldScale: worldScale,
      });

      useStore.setState({ paused: true });
      useStore.setState({ initialPaused: paused });

      useStore.getState().setXmls(xmls);
      // useStore.getState().setSelected(selectedElement);
      // useStore.setState({ initialSelected: selectedElement });

      useStore.setState({
        initialSelected: selectedElement,
        disabled,
        //paused,
        post,
        size: size ?? 3,
      });

      globalState.wraparoundEnabled = post.id > 938;
    })
    .catch((err) => {
      console.error(err);
      if (useStore.getState().expandedPostId !== idNumber) {
        return "cancel";
      }
      if (retrys < 5) {
        console.warn("retrying");
        return loadPostFromServer(postId, retrys + 1);
      } else {
        Sentry.captureException(err);
      }
    });

  if (useStore.getState().expandedPostId !== idNumber) {
    return "cancel";
  }

  useStore.setState({ postId: id });
  await fetch(`${imageURLBase}${id}.data.png`)
    .then((res) => res.blob())
    .then(async (blob) => {
      if (useStore.getState().expandedPostId !== idNumber) {
        return "cancel";
      }
      let ab = await blob.arrayBuffer();
      let { data } = decode(ab);
      useStore.setState({ initialSandsData: data });

      const nowTime = Date.now();
      const elapsedTime = nowTime - startTime;
      if (elapsedTime < 500) {
        await new Promise((r) => setTimeout(r, 500 - elapsedTime));
      }

      if (id >= 1436) {
        for (var i = 0; i < width * height * 4; i++) {
          sands[i] = data[i];
        }
      } else {
        // Backwards compatibility with posts from before the world was resizeable
        const edgePosition = 150;
        let dataIndex = 0;
        let sandsIndex = 0;
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            if (x < edgePosition && y < edgePosition) {
              sands[sandsIndex] = data[dataIndex];
              sands[sandsIndex + 1] = data[dataIndex + 1];
              sands[sandsIndex + 2] = data[dataIndex + 2];
              sands[sandsIndex + 3] = data[dataIndex + 3];
              sandsIndex += 4;
              dataIndex += 4;
            } else {
              sands[sandsIndex] = 0;
              sands[sandsIndex + 1] = randomData(x, y);
              sands[sandsIndex + 2] = 0;
              sands[sandsIndex + 3] = 0;
              sandsIndex += 4;
            }
          }
        }
      }

      await loadIntoEditor(idNumber);
      useStore.setState({ loading: false });
    });
}

const loadIntoEditor = async (idNumber = null) => {
  let ws = globalState.workspace;
  BlocklyJS.init(ws);

  const { setSelected } = useStore.getState();
  for (let i = useStore.getState().elements.length - 1; i >= 0; i--) {
    setSelected(i);

    ws.clear();

    await new Promise((resolve) => {
      if (useStore.getState().expandedPostId !== idNumber) {
        return "cancel";
      }
      let cb = () => {
        generateCode(i, ws);
        ws.removeChangeListener(cb);
        resolve();
      };
      ws.addChangeListener(cb);
      let xml = useStore.getState().xmls[i];
      let dom = Xml.textToDom(xml);
      try {
        Xml.domToWorkspace(dom, ws);
      } catch (e) {
        console.error(e);
      }
    });
  }
  setSelected(useStore.getState().initialSelected);
  useStore.setState({ paused: useStore.getState().initialPaused });
};
