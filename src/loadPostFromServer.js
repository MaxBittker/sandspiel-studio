import { decode } from "fast-png";
import starterXMLs from "./starterblocks";
import { globalState, useStore } from "./store";
import { width, height, sands } from "./SandApi";
import { worldScaleMap } from "./WorldSizeButtons.js";

const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

export async function loadPostFromServer(postId) {
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
        alert("I couldnt' find that data: " + id);
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
        worldSize: [],
      });

      globalState.wraparoundEnabled = post.id > 938;
    });

  fetch(`${imageURLBase}${id}.data.png`)
    .then((res) => res.blob())
    .then(async (blob) => {
      let ab = await blob.arrayBuffer();
      let { data } = decode(ab);
      useStore.setState({ initialSandsData: data });
      for (var i = 0; i < width * height * 4; i++) {
        sands[i] = data[i];
      }
      useStore.setState({ paused: desiredPaused });
    });
}
