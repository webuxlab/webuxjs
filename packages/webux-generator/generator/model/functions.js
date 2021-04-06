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
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const copy = require("fs-copy-file");
const fs = require("fs");
const path = require("path");

const FirstLetterCap = word => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

function CopyFile(dest, dbType) {
  return new Promise((resolve, reject) => {
    try {
      // The template path.
      const filepath = path.join(
        __dirname,
        "templates",
        dbType + "_template.js"
      );

      // copy the template to the final destination.
      copy(filepath, dest, function(err) {
        if (err) {
          reject(
            new Error(
              "An error occur while copying " + filepath + " -> " + dest
            )
          );
        } else {
          console.log(`\x1b[32m${dest} File copied with success !\x1b[0m`);
          return resolve();
        }
      });
    } catch (e) {
      throw e;
    }
  });
}

async function createFile(dest, dbType) {
  return new Promise((resolve, reject) => {
    try {
      fs.stat(dest, (err, stats) => {
        if (err && err.code !== "ENOENT") {
          // an error different than file not found occur
          return reject(err);
        } else if (err && err.code === "ENOENT") {
          CopyFile(dest, dbType)
            .then(() => {
              return resolve();
            })
            .catch(e => {
              return reject(e);
            });
        } else if (stats) {
          console.log(`\x1b[33m${dest} -> File already exist. SKIPPING\x1b[0m`);
          return resolve();
        }
      });
    } catch (e) {
      throw e;
    }
  });
}

// For each required files, check if it already exist
// Or copy it and replace the variable with the good values.
async function processFiles(files, dbType) {
  try {
    for (const dest of files) {
      await createFile(dest, dbType).catch(e => {
        throw e;
      });
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  processFiles,
  FirstLetterCap
};
