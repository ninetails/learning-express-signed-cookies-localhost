module.exports = {
  "*.{js,ts,tsx}": [
    "eslint --fix",
    "git add"
  ],
  "*.{md,json,yaml}": [
    "prettier --write",
    "git add"
  ]
}