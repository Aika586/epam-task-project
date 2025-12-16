import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    ignores: [
      'allure-report/**',
      'allure-results/**',
    ],
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },

    rules: {
      ...prettier.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
