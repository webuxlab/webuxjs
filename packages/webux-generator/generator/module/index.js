// ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
// ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
// ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
// ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
// ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
// ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-12-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const { prompt } = require('inquirer');
const { plural } = require('pluralize');
const path = require('path');
const { processFiles, FirstLetterCap } = require('./functions');
const { updateInfo } = require('../lib/utils');
const { createCache } = require('../lib/cache');
const { updateRoute } = require('./lib/route');
const { questions } = require('./questions');

const today = new Date().toISOString().slice(0, 10);

try {
  // Ask the question to create the files.
  prompt(questions).then((answers) => {
    try {
      if (answers.validation.toLowerCase() !== 'y') {
        return;
      }

      const cache = {
        apiVersion: answers.apiVersion,
        author: answers.author,
        license: answers.license,
        backendDir: answers.backendDir,
      };
      createCache(cache, 'cache.txt');

      const moduleName = answers.moduleName.toLowerCase();
      const { author } = answers;
      const { license } = answers;
      const { backendDir } = answers;
      const { apiVersion } = answers;
      const creationDate = today;
      const modelName = FirstLetterCap(moduleName);
      const moduleFilename = `${moduleName}.js`;
      const testFilename = `${moduleName}.spec.js`;
      const plurial = plural(moduleName);

      if (!path.isAbsolute(backendDir)) {
        throw new Error('The backend directory must be an absolute path.');
      }

      const files = [
        path.join(backendDir, 'api', apiVersion, 'actions', moduleName, 'create.js'),
        path.join(backendDir, 'api', apiVersion, 'actions', moduleName, 'update.js'),
        path.join(backendDir, 'api', apiVersion, 'actions', moduleName, 'remove.js'),
        path.join(backendDir, 'api', apiVersion, 'actions', moduleName, 'find.js'),
        path.join(backendDir, 'api', apiVersion, 'actions', moduleName, 'findOne.js'),
        // path.join(backendDir, 'models', moduleFilename), Temporaly removed
        path.join(backendDir, '__tests__', testFilename),
        path.join(backendDir, 'api', apiVersion, 'validations', moduleFilename),
        path.join(backendDir, 'api', apiVersion, 'helpers', moduleFilename),
        path.join(backendDir, 'api', apiVersion, 'constants', moduleFilename),
        // path.join(backendDir, 'defaults', moduleFilename),
      ];
      const options = {
        files,
        from: [
          /{{moduleName}}/g,
          /{{author}}/g,
          /{{license}}/g,
          /{{creationDate}}/g,
          /{{modelName}}/g,
          /{{moduleFilename}}/g,
          /{{plurial}}/g,
        ],
        to: [moduleName, author, license, creationDate, modelName, moduleFilename, plurial],
      };

      Promise.all([processFiles(files)])
        .then(() => {
          console.log('Webux Generator - update info');
          updateInfo(options).then(() => {
            updateRoute(backendDir, moduleName, apiVersion);
          });
        })
        .catch((error) => {
          console.error(`\x1b[31m${error}\x1b[0m`);
        });
    } catch (e) {
      console.error(`\x1b[31m${e}\x1b[0m`);
    }
  });
} catch (e) {
  console.error(`\x1b[31m${e}\x1b[0m`);
}
