module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    node: true,
  },
  extends: ["next"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {},
  settings: {
    react: {
      version: "detect",
    },
  },
};
