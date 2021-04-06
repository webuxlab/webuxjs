// ██████╗ ██╗   ██╗███████╗███████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// ██║   ██║██║   ██║█████╗  ███████╗   ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ╚██████╔╝╚██████╔╝███████╗███████║   ██║   ██║╚██████╔╝██║ ╚████║███████║
//  ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * File: questions.js
 * Author: Tommy Gingras
 * Date: 2020-01-23
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const path = require("path");
const { readCache } = require("../lib/cache");
let currentPath = process.cwd();

// if the user has not provide the backend path, otherwise let the path as is.
if (currentPath.indexOf("backend") < 0) {
  currentPath = path.join(currentPath, "backend");
}

let cache = readCache("cache.txt");

const questions = [
  {
    name: "modelName",
    type: "input",
    message: "model name:",
    validate: function(input) {
      if (/^([A-Za-z])+$/.test(input)) {
        return true;
      }
      return "The model name may only include letters";
    }
  },
  {
    name: "databaseType",
    type: "list",
    message: "Database",
    choices: ["MongoDB"]
  },
  {
    name: "author",
    type: "input",
    message: "Author name:",
    default: cache.author || ""
  },
  {
    name: "license",
    type: "input",
    message: "License:",
    default: cache.license || ""
  },
  {
    name: "backendDir",
    type: "input",
    message: "Backend Directory:",
    default: cache.backendDir || path.join(currentPath)
  },
  {
    name: "validation",
    type: "input",
    message: "Is it OK ? (Y/N):",
    default: "Y"
  }
];

module.exports = {
  questions
};
