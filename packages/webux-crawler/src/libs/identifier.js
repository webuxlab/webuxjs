const { v5: uuidv5 } = require('uuid');

const { sanitizeString } = require('./utils');

function domainName(url) {
  if (!url) {
    throw new Error('No url provided');
  }
  // Extract the domain only
  let domain = url.split(/https?:\/\//)[1];
  if (domain) {
    domain = domain.split('/')[0];
  } else {
    domain = url.split('/')[0];
  }

  let baseDomain = url.split(/(https?:\/\/)/)[1];
  baseDomain += domain;

  return { domain, baseDomain };
}

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

  // PATH
  const path = withoutProtocol.substring(withoutProtocol.indexOf('/'));

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

    path,

    ...domainName(url),
  };
}

module.exports = {
  generateIdentifier,
};
