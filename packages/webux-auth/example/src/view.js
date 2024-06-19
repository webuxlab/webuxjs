import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup EJS
 * @param {Object} app ExpressJS Application
 */
export function initView(app) {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, './views'));
}
