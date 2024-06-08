import path from 'node:path';
import { fileURLToPath } from "node:url";

import { WebuxApp } from '../../src/index.js';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

let webuxApp = new WebuxApp({
  configuration: path.join(__dirname, '..', 'config'),
});

/**
 * The express application
 */
webuxApp.app = app;

webuxApp.LoadConfiguration();
webuxApp.ConfigureLanguage();

module.exports = webuxApp;
