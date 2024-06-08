import puppeteer from 'puppeteer';
import constants from '../src/libs/constants.js';
import { getPage } from '../src/libs/puppeteer/page.js';
import { extractElements } from '../src/libs/puppeteer/elements.js';
import { extractMetas } from '../src/libs/puppeteer/meta.js';
import { getDocument, getBodyHtml, getTitle } from '../src/libs/puppeteer/html.js';
import { takeScreenshot } from '../src/libs/puppeteer/screenshot.js';
import { generateIdentifier } from '../src/libs/identifier.js';

(async () => {
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.1 Safari/605.1.15';
  const url = 'https://www.webuxlab.com/en/';
  let page;
  let browser;

  try {
    const instance = await getPage(url, userAgent, puppeteer, constants.extensions, false);

    page = instance.page;
    browser = instance.browser;

    console.debug('har', instance.har);
    console.debug('errors', instance.errors);

    const content = await extractElements(page, constants.elements);
    content.meta = await extractMetas(page, constants.metas);

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
