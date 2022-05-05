import starterXMLs from "./starterblocks.json";
import { deriveColor, globalState } from "./store";
export const serverAddr = "https://api.shaderbooth.com:3002/";
// export const serverAddr = "/api/getCreation/";

export async function loadShaderFromServer() {
  if (window.location.search.length <= 2) {
    globalState.xmls = starterXMLs.map((v, i) => {
      return v;
    });

    globalState.colors = globalState.xmls.map((v, i) => {
      return deriveColor(v);
    });
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
      console.log("loaded some code");

      globalState.xmls = code;
      globalState.colors = globalState.xmls.map((v, i) => {
        return deriveColor(v);
      });
    });
}
