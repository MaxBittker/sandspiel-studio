import starterXMLs from "./starterblocks.json";
import { useStore } from "./store";
export const serverAddr = "https://api.shaderbooth.com:3002/";

// export const serverAddr = "/api/getCreation/";

export async function loadShaderFromServer() {
  if (window.location.search.length <= 2) {
    useStore.getState().setXmls(starterXMLs.map((v, i) => v));

    return;
  }
  let id = window.location.search.slice(1);
  await fetch(serverAddr + "static/" + id)
    .then((response) => {
      if (response.status == 200) {
        return response.text();
      } else {
        alert("I couldnt' find that data: " + id);
      }
    })
    .then((data) => {
      let code = JSON.parse(data);
      console.log("loaded some code from " + id);

      useStore.getState().setXmls(code);
    });
}
