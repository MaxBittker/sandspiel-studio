import create from "zustand";

let useStore = create((set) => ({
  selectedElement: 1,
  updateScheme: "RANDOM_CYCLIC",
  taggedMode: false,
  setSelected: (e) => set(() => ({ selectedElement: e })),
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),
}));

export default useStore;
