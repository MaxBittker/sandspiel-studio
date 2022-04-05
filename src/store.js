import create from "zustand";

let useStore = create((set) => ({
  selectedElement: 1,
  updateScheme: "T2B_L2R_TAGGED",
  setSelected: (e) => set(() => ({ selectedElement: e })),
  setUpdateScheme: (e) => set(() => ({ updateScheme: e })),
}));

export default useStore;
