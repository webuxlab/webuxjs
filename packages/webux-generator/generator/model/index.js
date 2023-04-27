// ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
// ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
// ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
// ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
// ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
// ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-01-23
 * License: All rights reserved Studio Webux 2015-Present
 */

const { prompt } = require('inquirer');
const { plural } = require('pluralize');
const path = require('path');
const { processFiles, FirstLetterCap } = require('./functions');
const { updateInfo } = require('../lib/utils');
const { createCache } = require('../lib/cache');
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
        author: answers.author,
        license: answers.license,
        backendDir: answers.backendDir,
      };
      createCache(cache, 'cache.txt');

      const modelName = FirstLetterCap(answers.modelName.toLowerCase());
      const databaseType = answers.databaseType.toLowerCase();
      const { author } = answers;
      const { license } = answers;
      const { backendDir } = answers;
      const creationDate = today;
      const modelFilename = `${modelName}.js`;
      const plurial = plural(modelName);

      if (!path.isAbsolute(backendDir)) {
        throw new Error('The backend directory must be an absolute path.');
      }

      const files = [path.join(backendDir, 'models', modelFilename)];
      const options = {
        files,
        from: [
          /{{modelName}}/g,
          /{{author}}/g,
          /{{license}}/g,
          /{{creationDate}}/g,
          /{{modelName}}/g,
          /{{modelFilename}}/g,
          /{{plurial}}/g,
        ],
        to: [modelName, author, license, creationDate, modelName, modelFilename, plurial],
      };

      Promise.all([processFiles(files, databaseType)])
        .then(() => {
          console.log('Webux Generator - update info');
          updateInfo(options).catch((error) => {
            console.error(`\x1b[31m${error}\x1b[0m`);
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
