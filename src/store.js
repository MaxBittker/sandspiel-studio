import create from "zustand";
import tinycolor2 from "tinycolor2";
import starterXMLs from "./starterblocks.json";
let bufferXMLs = starterXMLs;
let totalPlaceholder =
  '<xml xmlns="https://developers.google.com/blockly/xml"><block type="sand_behavior_base"  deletable="false" x="40" y="100"><field name="ELEMENT_NAME">???</field><field name="COLOR">#af3aff</field><field name="COLOR2">#ffba2a</field></block></xml>';
let useStore = create((set, get) => ({
  selectedElement: 1,
  updateScheme: "RANDOM_CYCLIC",
  taggedMode: false,
  paused: false,
  setPaused: (e) => set(() => ({ paused: e })),
  setSelected: (e) => set(() => ({ selectedElement: e })),
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),
  xmls: [],
  elements: ["Air", "Wall", "Water", "Sand"],
  colors: [],
  color2s: [],

  popXml: () =>
    set(() => {
      let { xmls, setXmls } = get();
      let d = xmls.pop();
      bufferXMLs[xmls.length] = d;
      setXmls(xmls);
    }),

  pushXml: () =>
    set(() => {
      let { xmls, setXmls } = get();
      if (xmls.length >= 15) return;
      xmls.push(bufferXMLs[xmls.length] ?? totalPlaceholder);
      setXmls(xmls);
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
      const { colors, color2s, xmls, elements } = get();

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
      const { elements } = get();

      elements = elements.slice(0);
      elements[i] = name;

      return { elements };
    }),
}));

const globalState = {
  updaters: [],
  pallette: [],
  workspace: undefined,
  selectedElement: 1,
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
    return "???";
  }
  return match[1];
}

if (typeof window !== "undefined") {
  window.globalState = globalState;
}
export { useStore, globalState, deriveColor };
export default useStore;
