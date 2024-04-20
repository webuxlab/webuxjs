const puppeteer = require('puppeteer');

const { elements, metas, extensions } = require('../src/libs/constants');

const { getPage } = require('../src/libs/puppeteer/page');
const { extractElements } = require('../src/libs/puppeteer/elements');
const { extractMetas } = require('../src/libs/puppeteer/meta');
const { getDocument, getBodyHtml, getTitle } = require('../src/libs/puppeteer/html');
const { takeScreenshot } = require('../src/libs/puppeteer/screenshot');
const { generateIdentifier } = require('../src/libs/identifier');

(async () => {
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.1 Safari/605.1.15';
  const url = 'https://www.webuxlab.com/en/';
  let page;
  let browser;

  try {
    const instance = await getPage(url, userAgent, puppeteer, extensions, false);

    page = instance.page;
    browser = instance.browser;

    console.debug('har', instance.har);
    console.debug('errors', instance.errors);

    const content = await extractElements(page, elements);
    content.meta = await extractMetas(page, metas);

    const bodyHtml = await getBodyHtml(page);
    const document = await getDocument(page);
    const title = await getTitle(page);

    const { screenshot, errors } = await takeScreenshot(page, true);

    const identifier = await generateIdentifier(title, url);

    console.debug(
      content,

      instance.errors,
      instance.har,
      instance.resources,

      bodyHtml,
      document,
      title,

      screenshot,
      errors,

      url,
      userAgent,

      identifier,
    );
  } catch (e) {
    console.error(e.message);
    throw e;
  } finally {
    console.debug('Close Page');
    await page?.close();
    console.debug('Close Browser');
    await browser?.close();
  }
})();
