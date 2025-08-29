/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { es2021: true, browser: true, node: true },
  extends: [
    "next/core-web-vitals",
    "plugin:import/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:prettier/recommended" // siempre al final
  ],
  plugins: ["unused-imports"],
  rules: {
    "prettier/prettier": "error",
    "unused-imports/no-unused-imports": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true },
        "groups": [["builtin","external"], ["internal"], ["parent","sibling","index"]]
      }
    ]
  },
  settings: { tailwindcss: { callees: ["classnames","clsx","ctl"] } },
  overrides: [
    {
      files: ["api/**/*.{ts,js}", "scripts/**/*.{ts,js}", "*.{cjs,js}"],
      env: { node: true, browser: false },
      extends: ["plugin:import/recommended", "plugin:prettier/recommended"],
      rules: {}
    }
  ]
};
