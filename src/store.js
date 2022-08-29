import create from "zustand";
import { starterXMLs, generatePlaceholder } from "./blocks/starterblocks";
import { deriveColor, deriveName } from "./blocks/generator";
let bufferXMLs = starterXMLs;

export const MAX_ELEMENTS = 9;

let useStore = create((set, get) => ({
  // LOADED POST - BROWSE
  postId:
    typeof window !== "undefined"
      ? window?.location?.pathname?.slice(6)
      : undefined,
  post: null,
  initialSandsData: undefined,
  initialSelected: 3,
  initialWorldSize: 150,
  initialWorldScale: 1 / 2,
  initialPaused: false,

  // SIMULATION - PLAYGROUND
  pos: [0, 0],
  setPos: (e) => set(() => ({ pos: e })),
  selectedElement: 0,
  setSelected: (e) => set(() => ({ selectedElement: e })),
  paused: false,
  setPaused: (e) => set(() => ({ paused: e })),

  size: 3,
  setSize: (e) => set(() => ({ size: e })),
  worldScale: 1 / 2,
  setWorldScale: (e) => set(() => ({ worldScale: e })),
  worldWidth: 150,
  worldHeight: 150,
  worldCellCount: 150 * 150,
  setWorldSize: (e) => {
    const [worldWidth, worldHeight] = e;
    const worldCellCount = worldWidth * worldWidth;
    set({ worldWidth, worldHeight, worldCellCount });
  },

  updateScheme: "RANDOM_CYCLIC",
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  taggedMode: false,
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),

  // ELEMENTS - EDITOR+PLAYGROUND
  xmls: [],
  disabled: [],
  elements: ["Air", "Wall", "Water", "Sand"],
  colors: [],
  color2s: [],
  deleteSelectedElement: () =>
    set(() => {
      let { disabled, selectedElement, elements } = get();
      disabled[selectedElement] = true;

      for (var i = 0; i < 16; i++) {
        let candidate = (MAX_ELEMENTS + selectedElement - i) % MAX_ELEMENTS;

        if (elements[candidate] && !disabled[candidate]) {
          selectedElement = candidate;
          break;
        }
      }

      return { disabled, selectedElement };
    }),
  newElement: () =>
    set(() => {
      let { disabled, selectedElement, elements, xmls, setXmls } = get();

      if (xmls.length >= MAX_ELEMENTS && disabled.length == 0) return;

      for (var i = 0; i < 16; i++) {
        if (!elements[i] || disabled[i]) {
          delete disabled[i];
          xmls[i] = xmls[i] ?? bufferXMLs[i] ?? generatePlaceholder(i);
          selectedElement = i;
          break;
        }
      }

      setXmls(xmls);
      return { disabled, selectedElement };
    }),
  setXmls: (xmls) =>
    set(() => {
      xmls = xmls.filter((xml) => xml !== null);
      let colors = xmls.map((x) => deriveColor(x));
      let color2s = xmls.map((x) => deriveColor(x, 2));
      let elements = xmls.map((x) => deriveName(x));
      return { xmls, colors, color2s, elements };
    }),
  setXml: (x, i) =>
    set(() => {
      let { colors, color2s, xmls, elements } = get();

      xmls = xmls.slice(0);
      colors = colors.slice(0);
      elements = elements.slice(0);

      xmls[i] = x;
      colors[i] = deriveColor(x);
      color2s[i] = deriveColor(x, 2);
      elements[i] = deriveName(x);

      let [h, s, l] = colors[i];
      let color = `hsla(${h * 360},${s * 100}%,${l * 100}%,0.5)`;
      document.querySelector(".blocklyMainBackground").style.fill =
        color.replace("0.5", "0.3");

      return { xmls, colors, color2s, elements };
    }),
  setElementName: (i, name) =>
    set(() => {
      let { elements } = get();

      elements = elements.slice(0);
      elements[i] = name;

      return { elements };
    }),
}));

// Cached separately for performance reasons
const globalState = {
  updaters: [],
  workspace: undefined,
  wraparoundEnabled: true,
  worldWidth: 150,
  worldHeight: 150,
};

if (typeof window !== "undefined") {
  window.globalState = globalState;
}
export { useStore, globalState, deriveColor };
export default useStore;
