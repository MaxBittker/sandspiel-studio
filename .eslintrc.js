module.exports = {
  env: {
    commonjs: true,
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@next/next/recommended",
  ],
  globals: {},
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
    requireConfigFile: false,
  },
  plugins: ["react", "import", "react-hooks", "typescript"],
  ignorePatterns: ["node_modules/"],
  rules: {
    "no-alert": "off",
    "no-debugger": "off",
    "no-unused-vars": "off",
    "react/prop-types": "off",
  },
  settings: {
    react: {
      version: "detect", // "detect" automatically picks the version you have installed.
    },
  },
};
