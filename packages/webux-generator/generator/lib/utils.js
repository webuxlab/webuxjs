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
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const replace = require("replace-in-file");

const updateInfo = options => {
  return new Promise((resolve, reject) => {
    try {
      // If all the files have been copied, we can replace the content for each.
      replace(options)
        .then(changes => {
          console.log(
            `\x1b[32mModified files: ${
              changes.length > 0 ? changes.join(", ") : "None"
            }\x1b[0m`
          );
          return resolve();
        })
        .catch(error => {
          console.error(`\x1b[31mError occurred: ${error}\x1b[0m`);
          reject(error);
        });
    } catch (e) {
      throw e;
    }
  });
};

module.exports = { updateInfo };
