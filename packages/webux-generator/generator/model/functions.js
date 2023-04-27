// ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * File: functions.js
 * Author: Tommy Gingras
 * Date: 2020-01-21
 * License: All rights reserved Studio Webux 2015-Present
 */

const copy = require('fs-copy-file');
const fs = require('fs');
const path = require('path');

const FirstLetterCap = (word) => word.charAt(0).toUpperCase() + word.slice(1);

function CopyFile(dest, dbType) {
  return new Promise((resolve, reject) => {
    // The template path.
    const filepath = path.join(__dirname, 'templates', `${dbType}_template.js`);

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

async function createFile(dest, dbType) {
  return new Promise((resolve, reject) => {
    fs.stat(dest, (err, stats) => {
      if (err && err.code !== 'ENOENT') {
        // an error different than file not found occured
        return reject(err);
      }

      if (err && err.code === 'ENOENT') {
        // File not found, so copy it !
        return CopyFile(dest, dbType)
          .then(() => resolve())
          .catch((e) => reject(e));
      }

      if (stats) {
        console.log(`\x1b[33m${dest} -> File already exist. SKIPPING\x1b[0m`);
        return resolve();
      }

      // should never hit this return
      return reject(new Error(`Didn't copy the file : ${dest}`));
    });
  });
}

// For each required files, check if it already exist
// Or copy it and replace the variable with the good values.
async function processFiles(files, dbType) {
  for (const dest of files) {
    await createFile(dest, dbType).catch((e) => {
      throw e;
    });
  }
}

module.exports = {
  processFiles,
  FirstLetterCap,
};
