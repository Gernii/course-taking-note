/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
	root: true,
	extends: ["@repo/eslint-config/backend.js"],
  parserOptions: {
    project: true,
  },
};
