// eslint.mjs
export default {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
  },
  globals: {
    Given: "readonly",
    When: "readonly",
    Then: "readonly",
    Before: "readonly",
    After: "readonly",
    expect: "readonly",
  },
  overrides: [
    {
      files: ["features/**/*.js", "features/**/*.ts"],
      rules: {
        "no-undef": "off", // отключаем ошибки на глобальные шаги Cucumber
      },
    },
  ],
};
