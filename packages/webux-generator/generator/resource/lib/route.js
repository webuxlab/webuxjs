/**
 * File: route.js
 * Author: Tommy Gingras
 * Date: 2020-01-22
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const path = require('path');
const fs = require('fs');
const NewRoute = require('./route_definitions');

const updateRoute = (backendDir, resourceName, resourceFolder, method, apiVersion) =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(backendDir, 'config', 'routes.js'), 'utf8', (err, data) => {
      if (err || !data) {
        return reject(err || 'No data found');
      }

      if (data.indexOf(`"/${resourceName}"`) !== -1) {
        console.error(`\x1b[33mThe resource is already present in the route file. SKIPPING\x1b[0m`);
        return resolve();
      }

      const current = NewRoute(resourceName, resourceFolder, method, apiVersion, data, 'CRUD');

      return fs.writeFile(path.join(backendDir, 'config', 'routes.js'), current, (writeFileError) => {
        if (writeFileError) {
          reject(writeFileError);
        }

        console.log(`\x1b[32m "Route Definition updated.\x1b[0m`);
        console.log('Please, verify if everything is well configured');
        return resolve();
      });
    });
  });

module.exports = { updateRoute };
