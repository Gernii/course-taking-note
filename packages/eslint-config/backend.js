module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "eslint-config-turbo",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["unused-imports", "@typescript-eslint", "only-warn"],
  env: {
    node: true,
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "prefer-spread": "off",
    "no-case-declarations": "off",
    "no-console": "off",
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/consistent-type-imports": "warn",

    "@typescript-eslint/no-unnecessary-condition": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "no-undef": "off",
    "import/order": [
      "warn",
      {
        pathGroups: [
          {
            pattern: "$configs/**",
            position: "after",
            group: "external",
          },
          {
            pattern: "$databases/**",
            position: "after",
            group: "external",
          },
          {
            pattern: "$routes/**",
            position: "after",
            group: "external",
          },
          {
            pattern: "$utils/**",
            position: "after",
            group: "external",
          },
          {
            pattern: "$middlewares/**",
            position: "after",
            group: "external",
          },
          {
            pattern: "$models/**",
            position: "after",
            group: "external",
          },
          {
            pattern: "$controllers/**",
            position: "after",
            group: "external",
          },
        ],
        "newlines-between": "always",
      },
    ],
    "import/no-unresolved": "off",
    "import/no-named-as-default": "off",
    "import/default": "off",
    "import/no-named-as-default-member": "off",
  },
  ignorePatterns: ["*.*js"],
};
