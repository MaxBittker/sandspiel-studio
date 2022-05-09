import starterXMLs from "./starterblocks.json";
import { useStore } from "./store";

export async function loadPostFromServer() {
  if (window.location.search.length < 1) {
    useStore.getState().setXmls(starterXMLs.map((v, i) => v));

    return;
  }
  let id = window.location.search.slice(1);
  await fetch("api/getCreation/" + id)
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
      useStore.getState().setXmls(code);
    });
}
