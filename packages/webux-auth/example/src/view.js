import path from 'path';

const __dirname = path.resolve();

/**
 * Setup EJS
 * @param {Object} app ExpressJS Application
 */
export function initView(app) {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, './views'));
}
