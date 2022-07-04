import { cellCount } from "./SandApi.js";
import create from "zustand";
import tinycolor2 from "tinycolor2";
import starterXMLs from "./starterblocks";
let bufferXMLs = starterXMLs;

function generatePlaceholder(i) {
  const color = tinycolor2.random();
  const name = "ABCDEABCDEFGHIJKLMNOPQRSTUVWXYZ"[i];
  return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="sand_behavior_base"  deletable="false" x="40" y="100"><field name="ELEMENT_NAME">${name}?</field><field name="COLOR">${color
    .lighten(15)
    .toHex()}</field><field name="COLOR2">${color.darken(15).toHex()}</field>
<next><block type="if" ><mutation elseIds=""></mutation><value name="CONDITION"><block type="is_block" ><value name="CELL"><shadow type="vector_constant" ><field name="VALUE">DOWN</field></shadow></value><value name="ELEMENT"><shadow type="element_literal" ><field name="VALUE">0</field></shadow><block type="group" ><mutation itemCount="1"></mutation><value name="ITEM0"><shadow type="element_literal" ><field name="VALUE">0</field></shadow></value></block></value></block></value><statement name="THEN"><block type="move" ><value name="DIRECTION"><shadow type="vector_constant" ><field name="VALUE">DOWN</field></shadow></value></block></statement></block></next></block></xml>`;
}

export const MAX_ELEMENTS = 9;

let useStore = create((set, get) => ({
  pos: [0, 0],
  setPos: (e) => set(() => ({ pos: e })),
  selectedElement: 0,
  initialSandsData: undefined,
  initialSelected: 3,
  updateScheme: "RANDOM_CYCLIC",
  taggedMode: false,
  paused: false,
  size: 3,
  worldWidth: 150,
  worldHeight: 150,
  worldCellCount: 150 * 150,
  postId:
    typeof window !== "undefined"
      ? window?.location?.pathname?.slice(6)
      : undefined,
  post: null,
  setSize: (e) => set(() => ({ size: e })),
  setWorldSize: (e) => {
    const [worldWidth, worldHeight] = e;
    const worldCellCount = worldWidth * worldWidth;
    set({ worldWidth, worldHeight, worldCellCount });
  },
  setPaused: (e) => set(() => ({ paused: e })),
  setSelected: (e) => set(() => ({ selectedElement: e })),
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),
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

const globalState = {
  updaters: [],
  workspace: undefined,
  wraparoundEnabled: true,
};

function deriveColor(xmlString, b = "") {
  let pattern = `<field name="COLOR${b}">`;
  let pl = pattern.length;
  let location = xmlString.indexOf(pattern);
  let colorString = xmlString.slice(location + pl, location + pl + 7);
  let color = tinycolor2(colorString).toHsl();
  return [color.h / 360, color.s, color.l];
}
function deriveName(xmlString) {
  const r = /<field name="ELEMENT_NAME">(.*?)<\/field>/;
  const match = r.exec(xmlString);
  if (!match) {
    return "?";
  }
  return match[1];
}

if (typeof window !== "undefined") {
  window.globalState = globalState;
}
export { useStore, globalState, deriveColor };
export default useStore;
