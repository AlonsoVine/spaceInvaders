import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['legacy/**', 'node_modules/**', 'coverage/**', 'dist/**', '_site/**']
  },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.mjs', 'eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  }
];
