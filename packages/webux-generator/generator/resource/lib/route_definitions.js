/**
 * File: route_definitions.js
 * Author: Tommy Gingras
 * Date: 2019-07-19
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

/**
 *
 * @param {string} resourceName  the resource name entered
 * @param {string} resourceFolder the resource top folder entered
 * @param {string} method  the HTTP Method entered
 * @param {string} apiVersion the version, for example 'v1'
 * @param {string} data the current content of the routes.js file
 * @param {string} ops  Must Be letter that part of that word 'CRUD'
 * @returns {string} the new route entry.
 */

function NewRoute(resourceName, resourceFolder, method, apiVersion, data) {
  let base = `"/${resourceFolder || resourceName}":{resources:{`;
  let resource = '';

  if (resourceFolder) {
    resource = `{method:"${method}", middlewares:[], action: require(path.join(__dirname, "..", "api", "${apiVersion}", "actions","${resourceFolder}","${resourceName}")).route},`;
  } else {
    resource = `{method:"${method}", middlewares:[], action: require(path.join(__dirname, "..", "api", "${apiVersion}", "actions","${resourceName}")).route},`;
  }

  if (!resourceFolder) {
    base += '"/":[';
  } else {
    base += `"/${resourceName}":[`;
  }

  // Create resources accroding of the CRUD parameter
  base += `${resource}]}},`;

  let current = data.substr(0, data.indexOf('};'));

  const lastChar = JSON.stringify(current).replace(/\\n/g, '').trim();

  if (lastChar[lastChar.length - 2] === '}') {
    current += `, ${base}};`;
  } else {
    current += `${base}};`;
  }

  return current;
}

module.exports = NewRoute;
