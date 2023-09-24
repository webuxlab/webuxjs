/**
 * Get the inner HTML
 * @param {Object} page
 * @returns String
 */
function getBodyHtml(page) {
  return page.$eval('body', (el) => el.innerHTML);
}

/**
 * Get the whole page (from the document)
 * @param {Object} page
 * @returns String
 */
function getDocument(page) {
  return page.content();
}

/**
 * Get the page title
 * @param {Object} page
 * @returns String
 */
function getTitle(page) {
  return page.title();
}

module.exports = {
  getBodyHtml,
  getDocument,
  getTitle,
};
