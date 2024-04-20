import globals from 'globals';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  ...compat.extends('airbnb-base'),
  eslintPluginPrettierRecommended,
  {
    rules: {
      'no-restricted-syntax': 'warn',
      'no-async-promise-executor': 'warn',
      'import/no-unresolved': 'off',
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-underscore-dangle': 'warn',
      'class-methods-use-this': 'warn',
      'no-await-in-loop': 'warn',
      'import/no-amd': 'warn',
      'import/newline-after-import': 'warn',
    },
  },
];
