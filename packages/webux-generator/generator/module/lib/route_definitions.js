/**
 * File: route_definitions.js
 * Author: Tommy Gingras
 * Date: 2019-07-19
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

/**
 *
 * @param {string} moduleName  the module name entered
 * @param {string} apiVersion the version, for example 'v1'
 * @param {string} data the current content of the routes.js file
 * @param {string} ops  Must Be letter that part of that word 'CRUD'
 * @returns {string} the new route entry.
 */

function NewRoute(moduleName, apiVersion, data, ops = 'CRUD') {
  let base = `"/${moduleName}":{resources:{`;
  let create = '';
  let update = '';
  let findOne = '';
  let find = '';
  let remove = '';

  if (ops.indexOf('C') !== -1) {
    create = `{method:"post", middlewares:[], action: require(path.join(__dirname, "..", "api", "${apiVersion}", "actions","${moduleName}","create")).route},`;
  }

  if (ops.indexOf('R') !== -1) {
    find = `{method:"get", middlewares:[Webux.query(  Webux.constants.${moduleName}.blacklist,  Webux.constants.${moduleName}.select)], action: require(path.join(__dirname, "..", "api", "${apiVersion}", "actions","${moduleName}","find")).route},`;

    findOne = `{method:"get", middlewares:[Webux.query(  Webux.constants.${moduleName}.blacklist,  Webux.constants.${moduleName}.select)], action: require(path.join(__dirname, "..", "api", "${apiVersion}", "actions","${moduleName}","findOne")).route},`;
  }

  if (ops.indexOf('U') !== -1) {
    update = `{method:"put", middlewares:[], action: require(path.join(__dirname, "..", "api", "${apiVersion}", "actions","${moduleName}","update")).route},`;
  }

  if (ops.indexOf('D') !== -1) {
    remove = `{method:"delete", middlewares:[], action: require(path.join(__dirname, "..", "api", "${apiVersion}", "actions","${moduleName}","remove")).route},`;
  }

  base += '"/":[';

  // Create resources accroding of the CRUD parameter
  base += `${create + find}],`;
  base += `"/:id":[${findOne}${update}${remove}]}},`;

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
