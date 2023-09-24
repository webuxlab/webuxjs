const { v5: uuidv5 } = require('uuid');

const { sanitizeString } = require('./utils');

/**
 * Generate Identifier using the title and url information
 * @param {String} title
 * @param {String} url
 * @returns {documentId,identifier,title,timestamp,url,withoutProtocol,noTrailing,uuid,uuidWithoutProtocol,uuidNoTrailing}
 */
function generateIdentifier(title, url) {
  const timestamp = new Date();

  // URL
  const withoutProtocol = url.split(/^https?:\/\//)[1];
  const noTrailing = url.split(/^https?:\/\//)[1].endsWith('/')
    ? url.split(/^https?:\/\//)[1].slice(0, withoutProtocol.length - 1)
    : url.split(/^https?:\/\//)[1];

  // UUID
  const uuidWithoutProtocol = uuidv5(withoutProtocol, uuidv5.URL);
  const uuidNoTrailing = uuidv5(noTrailing, uuidv5.URL);
  const uuid = uuidv5(url, uuidv5.URL);

  return {
    documentId: sanitizeString(title),
    identifier: sanitizeString(`${title}_${timestamp.toISOString().split('T')[0]}`),
    title,
    timestamp,

    url,
    withoutProtocol,
    noTrailing,

    uuid,
    uuidWithoutProtocol,
    uuidNoTrailing,
  };
}

module.exports = {
  generateIdentifier,
};
