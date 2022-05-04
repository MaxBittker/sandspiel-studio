export let elements = [
  "Air",
  "Water",
  "Sand",
  "Wall",
  "Plant",
  "Stone",
  "Cloner",
  "Fire",
  "Ice",
  "Gas",
  "Mite",
  "Wood",
  "Fungus",
  "Seed",
  "Lava",
  "Acid",
  "Dust",
  "Oil",
  "Rocket",
];

export let disabledElements = ["Mite", "Fungus", "Oil", "Rocket"];

export function getElementNames() {
  return elements.filter((element) => !disabledElements.includes(element));
}

export function setElementName(id, name) {
  elements[id] = name;
}

export default elements;
