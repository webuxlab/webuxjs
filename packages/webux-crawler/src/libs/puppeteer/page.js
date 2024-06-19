import PuppeteerHar from 'puppeteer-har';

/**
 * Open a browser, open a page, intercept Requests for media, collect HAR, and crawl the URL
 * The page and browser aren't closed. They are kept open to perform further commands.
 * @param {String} url URL to crawl
 * @param {String} agent User agent to use
 * @param {Object} puppeteer Puppeteer Instance
 * @param {String[]} extensions Extensions to intercept and build a resource array
 * @param {boolean} headless Default: false
 * @returns { browser, page, har, errors, resources }
 */
export async function getPage(url, agent, puppeteer, extensions, headless = false) {
  const errors = [];
  const resources = {
    images: [],
    videos: [],
    audios: [],
    fonts: [],
  };

  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  await page.setUserAgent(agent);

  // Start HAR
  const har = new PuppeteerHar(page);
  await har.start().catch((e) => {
    errors.push(e.message);
    throw e;
  });

  // Request Interceptor
  page.on('request', (interceptedRequest) => {
    if (interceptedRequest.isInterceptResolutionHandled()) {
      return;
    }

    // IMAGES
    if (extensions.image.some((ext) => interceptedRequest.url().toLowerCase().endsWith(ext))) {
      resources.images.push(interceptedRequest.url());
    }

    // VIDEOS
    if (extensions.video.some((ext) => interceptedRequest.url().toLowerCase().endsWith(ext))) {
      resources.videos.push(interceptedRequest.url());
    }

    // AUDIOS
    if (extensions.audio.some((ext) => interceptedRequest.url().toLowerCase().endsWith(ext))) {
      resources.audios.push(interceptedRequest.url());
    }

    // FONTS
    if (extensions.font.some((ext) => interceptedRequest.url().toLowerCase().endsWith(ext))) {
      resources.fonts.push(interceptedRequest.url());
    }

    // NEXT
    interceptedRequest.continue();
  });

  await page.goto(url);
  await page.setViewport({ width: 3024, height: 1964 });

  // Events
  page.on('requestfailed', (err) => {
    errors.push(`Request has failed, see logs for more details (${err.message || err})`);
  });

  // Cleanup
  await har.stop();

  return {
    browser,
    page,
    har,
    errors,
    resources,
  };
}
