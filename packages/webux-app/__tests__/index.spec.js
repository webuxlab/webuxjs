import { WebuxApp } from '../src/index.js';

test('Creates Application with no options', () => {
  const app = new WebuxApp();

  expect(app).toMatchObject({
    i18n: null,
    log: console,
    config: {},
  });
});
