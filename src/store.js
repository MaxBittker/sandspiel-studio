import create from "zustand";

let useStore = create((set) => ({
  selectedElement: 1,
  updateScheme: "ORDERED",
  taggedMode: true,
  setSelected: (e) => set(() => ({ selectedElement: e })),
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
  setTaggedMode: (e) => set(() => ({ taggedMode: e })),
}));

export default useStore;
