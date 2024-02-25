/** @type {import("eslint").Linter.Config} */

module.exports = {
  root: true,
  extends: [
    '@brezel/eslint/next.js',
    'plugin:@tanstack/eslint-plugin-query/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  }
}
