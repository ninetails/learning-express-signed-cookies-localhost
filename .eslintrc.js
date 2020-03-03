module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "prettier",
    "standard-with-typescript",
    "prettier/@typescript-eslint",
    "prettier/standard"
  ],
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "import/order": ["error", {"newlines-between": "never"}],
    "@typescript-eslint/indent": ["error", 2]
  }
}
