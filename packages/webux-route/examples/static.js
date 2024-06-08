import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import WebuxRoute from '../src/index.js';
// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const resources = [
  {
    path: '/public',
    resource: path.join(__dirname, 'public'),
  },
  {
    path: '/img',
    resource: path.join(__dirname, 'images'),
  },
];

const webuxRoute = new WebuxRoute();
webuxRoute.LoadStatic(app, express, resources);

app.listen(1337, () => {
  console.log('Server is listening on port 1337');
});

// http://localhost:1337/public/
// http://localhost:1337/img/favicon.ico
