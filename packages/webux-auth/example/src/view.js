import path from 'node:path';

/**
 * Setup EJS
 * @param {Object} app ExpressJS Application
 */
function initView(app) {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, './views'));
}

module.exports = { initView };
