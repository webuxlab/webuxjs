// ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * File: functions.js
 * Author: Tommy Gingras
 * Date: 2018-24-05
 * License: All rights reserved Studio Webux 2015-Present
 */

const copy = require('fs-copy-file');
const fs = require('fs');
const path = require('path');

const FirstLetterCap = (word) => word.charAt(0).toUpperCase() + word.slice(1);

function CopyFile(dest) {
  return new Promise((resolve, reject) => {
    const template = dest.split(path.sep);

    // the filepath content the template path.
    const filepath =
      dest.indexOf(`${path.sep}actions${path.sep}`) === -1
        ? path.join(
            __dirname,
            'templates',
            `${template[template.length - 2]}_template.js`, // if it is not an action
          )
        : path.join(
            __dirname,
            'templates',
            `${template[template.length - 1].split('.js')[0]}_template.js`, // if it is an action
          );

    // copy the template to the final destination.
    copy(filepath, dest, (err) => {
      if (err) {
        return reject(new Error(`An error occur while copying ${filepath} -> ${dest}`));
      }
      console.log(`\x1b[32m${dest} File copied with success !\x1b[0m`);
      return resolve();
    });
  });
}

async function createFile(dest) {
  return new Promise((resolve, reject) => {
    fs.stat(dest, (err, stats) => {
      if (err && err.code !== 'ENOENT') {
        // an error different than file not found occur
        return reject(err);
      }

      if (err && err.code === 'ENOENT') {
        if (dest.indexOf('actions') !== -1) {
          const splitModuleName = dest.split(path.sep);

          const moduleName =
            dest.substr(0, dest.lastIndexOf(`actions${path.sep}`) + 8) + // base
            splitModuleName[splitModuleName.length - 2]; // module name

          return fs.mkdir(moduleName, (mkdirError) => {
            if (mkdirError && mkdirError.code !== 'ENOENT' && mkdirError.code !== 'EEXIST') {
              reject(mkdirError);
            }
            CopyFile(dest)
              .then(() => resolve())
              .catch((e) => reject(e));
          });
        }

        return CopyFile(dest)
          .then(() => resolve())
          .catch((e) => reject(e));
      }

      if (stats) {
        console.log(`\x1b[33m${dest} -> File already exist. SKIPPING\x1b[0m`);
        return resolve();
      }

      return reject(new Error(`File ${dest} not created`));
    });
  });
}

// For each required files, check if it already exist
// Or copy it and replace the variable with the good values.
async function processFiles(files) {
  await Promise.all(files.map((dest) => createFile(dest)));

  console.log('done');
}
module.exports = {
  processFiles,
  FirstLetterCap,
};
