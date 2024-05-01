import globals from 'globals';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
const jest = require('eslint-plugin-jest');

import local from '../.eslintrc.js';

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
  local,
  ...require('@eslint/js').configs.recommended,
  {
    files: ['__tests__/**'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  // you can also configure jest rules in other objects, so long as some of the `files` match
  {
    files: ['__tests__/**'],
    rules: { 'jest/prefer-expect-assertions': 'off' },
  },
];
