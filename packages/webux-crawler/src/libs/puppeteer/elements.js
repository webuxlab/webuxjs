/**
 * Extract Elements from the page
 * @param {Object} page
 * @param {String[]} elements
 * @returns { page: Object, elements: String[], content: {} }
 */
async function extractElements(page, elements) {
  const content = {};
  for await (const element of elements) {
    content[element] = await page.$$eval(element, (htmlElements) =>
      htmlElements
        .map((el) => {
          //   Images
          if (el && el.getAttribute('src') && el.getAttribute('src') !== '') {
            return {
              src: el.getAttribute('src'),
              alt: el.getAttribute('alt'),
            };
          }

          //   URLs
          if (el && el.getAttribute('href') && el.getAttribute('href') !== '') {
            return {
              href: el.getAttribute('href'),
            };
          }

          //   Text
          if (el && el.textContent && el.textContent.trim() !== '') return el.textContent.trim().toLowerCase();

          //   Unknown
          return null;
        })
        .filter((el) => el !== null),
    );
  }

  return { page, elements, content };
}

module.exports = {
  extractElements,
};
