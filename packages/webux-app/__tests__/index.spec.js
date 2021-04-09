const WebuxApp = require('../src');

test('Creates Application with no options', () => {
  const app = new WebuxApp.WebuxApp();

  expect(app).toMatchObject({
    i18n: null,
    log: console,
    config: {},
  });
});
