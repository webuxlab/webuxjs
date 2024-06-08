import { WebuxApp } from '../src/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  configuration: path.join(__dirname, 'config'),
};

const webuxApp = new WebuxApp(options);

console.log(webuxApp.config);

console.log('---');
await webuxApp.LoadConfiguration();
console.log(webuxApp.config);

console.log('+++');
webuxApp.config._manual = {
  testing: 'test1',
};
console.log(webuxApp.config);
