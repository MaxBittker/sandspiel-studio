import create from "zustand";

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
  updaters: [],
  workspace: undefined,
  selectedElement: 1,
};

if (typeof window !== "undefined") {
  window.globalState = globalState;
}
export { globalState };
export default useStore;
