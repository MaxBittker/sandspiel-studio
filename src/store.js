import create from "zustand";

let useStore = create((set) => ({
  selectedElement: 1,
  setSelected: (e) => set(() => ({ selectedElement: e })),
}));

export default useStore;
