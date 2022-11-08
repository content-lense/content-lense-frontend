module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["next", "plugin:react/recommended", "standard-with-typescript"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {},
};
