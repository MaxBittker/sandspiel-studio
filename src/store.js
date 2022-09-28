import create from "zustand";
import starterXMLs, { generatePlaceholder } from "./blocks/starterblocks";
import { deriveColor, deriveName } from "./blocks/generator";
let bufferXMLs = starterXMLs;

export const MAX_ELEMENTS = 15;

let useStore = create((set, get) => ({
  // BROWSE
  post: null,
  expandedPostId: null,
  initialSandsData: undefined,
  initialSelected: 3,
  initialWorldSize: 75,
  initialWorldScale: 1 / 4,
  initialPaused: false,
  loading: false,

  // PLAYGROUND
  pos: [-1, -1],
  setPos: (e) => set(() => ({ pos: e })),
  selectedElement: 0,
  setSelected: (e) => set(() => ({ selectedElement: e })),
  paused: false,
  setPaused: (e) => set(() => ({ paused: e })),

  size: 3,
  setSize: (e) => set(() => ({ size: e })),
  worldScale: 1 / 4,
  setWorldScale: (e) => set(() => ({ worldScale: e })),
  worldWidth: 75,
  worldHeight: 75,
  worldCellCount: 75 * 75,
  setWorldSize: (e) => {
    const [worldWidth, worldHeight] = e;
    const worldCellCount = worldWidth * worldWidth;
    set({ worldWidth, worldHeight, worldCellCount });
  },

  updateScheme: "RANDOM_CYCLIC",
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  taggedMode: false,
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),

  // EDITOR + PLAYGROUND
  xmls: [],
  disabled: [],
  elements: ["Air", "Wall", "Water", "Sand"], // these elements are listed here so that the toolbox displays properly
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
          disabled[i] = false;
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
  worldWidth: 75,
  worldHeight: 75,
};

if (typeof window !== "undefined") {
  window.globalState = globalState;
}
export { useStore, globalState, deriveColor };
export default useStore;
