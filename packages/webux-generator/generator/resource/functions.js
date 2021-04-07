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

const FirstLetterCap = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

function CopyFile(dest) {
  return new Promise((resolve, reject) => {
    try {
      const template = dest.split(path.sep);

      // the filepath content the template path.
      const filepath = !dest.includes(path.sep + "actions" + path.sep)
        ? path.join(
            __dirname,
            "templates",
            template[template.length - 2] + "_template.js" // if it is not an action
          )
        : path.join(
            __dirname,
            "templates",
            "resource_template.js" // if it is an action
          );

      // copy the template to the final destination.
      copy(filepath, dest, function (err) {
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

async function createFile(dest, resourceFolder = "") {
  return new Promise((resolve, reject) => {
    try {
      fs.stat(dest, (err, stats) => {
        if (err && err.code !== "ENOENT") {
          // an error different than file not found occur
          return reject(err);
        } else if (err && err.code === "ENOENT") {
          if (dest.includes("actions") && resourceFolder) {
            let parsedResourceFolder =
              dest.substr(0, dest.lastIndexOf("actions" + path.sep) + 8) + // base
              resourceFolder; // resource folder

            fs.mkdir(parsedResourceFolder, (err) => {
              if (err && err.code !== "ENOENT" && err.code !== "EEXIST") {
                reject(err);
              }
              CopyFile(dest)
                .then(() => {
                  return resolve();
                })
                .catch((e) => {
                  return reject(e);
                });
            });
          } else {
            CopyFile(dest)
              .then(() => {
                return resolve();
              })
              .catch((e) => {
                return reject(e);
              });
          }
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
async function processFiles(files, resourceFolder) {
  try {
    for (const dest of files) {
      await createFile(dest, resourceFolder).catch((e) => {
        throw e;
      });
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  processFiles,
  FirstLetterCap,
};
