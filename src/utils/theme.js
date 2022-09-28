export const THEME_COLOR_NAMES = [
  "fuschia",
  "purple",
  "blue",
  "sky",
  "teal",
  "green",
  "lime",
  "yellow",
  "sand",
];

export const getRandomColorName = () => {
  const id = Math.floor(Math.random() * THEME_COLOR_NAMES.length);
  return THEME_COLOR_NAMES[id];
};
