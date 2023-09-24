// Constants
const { elements, fileTypes, metas, extensions } = require('./libs/constants');

// Utils
const { generateIdentifier } = require('./libs/identifier');
const { sanitizeImg, sanitizeString } = require('./libs/utils');

// Puppeteer
const { extractElements } = require('./libs/puppeteer/elements');
const { getBodyHtml, getDocument, getTitle } = require('./libs/puppeteer/html');
const { extractMetas } = require('./libs/puppeteer/meta');
const { getPage } = require('./libs/puppeteer/page');
const { takeScreenshot } = require('./libs/puppeteer/screenshot');

module.exports = {
  elements,
  fileTypes,
  metas,
  extensions,

  generateIdentifier,

  sanitizeImg,
  sanitizeString,

  extractElements,
  getBodyHtml,
  getDocument,
  getTitle,
  extractMetas,
  getPage,
  takeScreenshot,
};
