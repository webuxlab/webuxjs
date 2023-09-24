/**
 * Extract named metadatas from the HTML
 * @param {Object} page
 * @param {String[]} metas
 * @returns { page, metas, content }
 */
async function extractMetas(page, metas) {
  const content = {};
  for await (const meta of metas) {
    content[meta] = await page.$$eval(`meta[name="${meta}"]`, (elements) => elements.map((el) => el.content).filter((el) => el !== null));
  }

  return { page, metas, content };
}

module.exports = {
  extractMetas,
};
