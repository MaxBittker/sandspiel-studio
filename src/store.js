import create from "zustand";
import tinycolor2 from "tinycolor2";
let useStore = create((set) => ({
  selectedElement: 1,
  updateScheme: "RANDOM_CYCLIC",
  taggedMode: false,
  setSelected: (e) => set(() => ({ selectedElement: e })),
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),
}));

const globalState = {
  xmls: [],
  colors: [],
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
if (typeof window !== "undefined") {
  window.globalState = globalState;
}
export { globalState, deriveColor };
export default useStore;
