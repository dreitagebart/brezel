/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@brezel/eslint/next.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  }
}
