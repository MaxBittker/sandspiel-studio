import { decode } from "fast-png";
import starterXMLs from "./starterblocks.json";
import { useStore } from "./store";
import { width, height, sands } from "./SandApi";

const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

export async function loadPostFromServer() {
  let id = window.location.pathname.slice(6);

  if (id.length < 1) {
    useStore.getState().setXmls(starterXMLs.slice(0, 4).map((v, i) => v));

    return;
  }

  fetch(`${imageURLBase}${id}.data.png`)
    .then((res) => res.blob())
    .then(async (blob) => {
      let ab = await blob.arrayBuffer();
      let { data } = decode(ab);
      for (var i = 0; i < width * height * 4; i++) {
        sands[i] = data[i];
      }
    });

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
      let code = JSON.parse(data.code);
      if (Array.isArray(code)) {
        //beta legacy lol
        useStore.getState().setXmls(code);
      } else {
        let { xmls, selectedElement, paused } = code;
        useStore.getState().setXmls(xmls);
        useStore.getState().setSelected(selectedElement);
        useStore.setState({ initialSelected: selectedElement });

        useStore.setState({ initialSelected: selectedElement, paused });
      }
    });
}
