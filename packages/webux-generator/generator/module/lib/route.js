/**
 * File: route.js
 * Author: Tommy Gingras
 * Date: 2019-07-19
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const path = require('path');
const fs = require('fs');
const NewRoute = require('./route_definitions');

const updateRoute = (backendDir, moduleName, apiVersion) =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(backendDir, 'config', 'routes.js'), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      if (data.indexOf(`"/${moduleName}"`) !== -1) {
        console.error(`\x1b[33mThe resource is already present in the route file. SKIPPING\x1b[0m`);
        return resolve();
      }

      const current = NewRoute(moduleName, apiVersion, data, 'CRUD');

      return fs.writeFile(path.join(backendDir, 'config', 'routes.js'), current, (writeFileError) => {
        if (writeFileError) {
          return reject(writeFileError);
        }

        console.log(`\x1b[32m "Route Definition updated.\x1b[0m`);
        return resolve();
      });
    });
  });

module.exports = { updateRoute };
