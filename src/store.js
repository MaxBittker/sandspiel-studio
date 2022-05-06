import create from "zustand";
import tinycolor2 from "tinycolor2";
let useStore = create((set, get) => ({
  selectedElement: 1,
  updateScheme: "RANDOM_CYCLIC",
  taggedMode: false,
  setSelected: (e) => set(() => ({ selectedElement: e })),
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),
  xmls: [],
  elements: ["sand"],
  colors: [],

  setXmls: (xmls) =>
    set(() => {
      let colors = xmls.map((x) => deriveColor(x));
      let elements = xmls.map((x) => deriveName(x));
      return { xmls, colors, elements };
    }),

  setXml: (x, i) =>
    set(() => {
      const { colors, xmls, elements } = get();

      xmls = xmls.slice(0);
      colors = colors.slice(0);
      elements = elements.slice(0);

      xmls[i] = x;
      colors[i] = deriveColor(x);
      elements[i] = deriveName(x);
      return { xmls, colors, elements };
    }),

  setElementName: (name, i) =>
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

function deriveColor(xmlString) {
  let pattern = '<field name="COLOR">';
  let pl = pattern.length;
  let location = xmlString.indexOf(pattern);
  let colorString = xmlString.slice(location + pl, location + pl + 7);
  let color = tinycolor2(colorString).toHsl();
  return [color.h / 360, color.s, color.l];
}
function deriveName(xmlString) {
  const r = /<field name="NAME">(.*?)<\/field>/;
  const match = r.exec(xmlString);
  return match[1];
}

if (typeof window !== "undefined") {
  window.globalState = globalState;
}
export { useStore, globalState, deriveColor };
export default useStore;
