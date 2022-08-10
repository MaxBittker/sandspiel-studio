import { decode } from "fast-png";
import starterXMLs from "./starterblocks";
import { globalState, useStore } from "./store";
import { width, height, sands, randomData } from "./SandApi";
import { worldScaleMap } from "./WorldSizeButtons.js";
import * as Sentry from "@sentry/nextjs";

const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

export async function loadPostFromServer(postId, retrys = 0) {
  let id = postId;

  if (isNaN(parseInt(id, 10)) || id.length < 1) {
    useStore.getState().setXmls(starterXMLs.slice(0, 4).map((v, i) => v));
    return;
  }

  let desiredPaused = false;

  await fetch("/api/getCreation/" + id)
    .then((response) => {
      if (response.status == 200) {
        return response.text();
      } else {
        console.error("I couldnt' find that data: " + id);
        throw "getCreation err";
      }
    })
    .then((raw) => {
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
        worldScale = 1,
      } = JSON.parse(metadata);

      if (!worldScaleMap.includes(worldScale)) {
        worldScale = 1;
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

      useStore.setState({
        initialWorldSize: worldWidth,
        initialWorldScale: worldScale,
      });

      useStore.setState({ paused: true });
      desiredPaused = paused;

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
      if (retrys < 5) {
        console.warn("retrying");
        return loadPostFromServer(postId, retrys + 1);
      } else {
        Sentry.captureException(err);
      }
    });

  fetch(`${imageURLBase}${id}.data.png`)
    .then((res) => res.blob())
    .then(async (blob) => {
      let ab = await blob.arrayBuffer();
      let { data } = decode(ab);
      useStore.setState({ initialSandsData: data });

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

      useStore.setState({ paused: desiredPaused });
    });
}
