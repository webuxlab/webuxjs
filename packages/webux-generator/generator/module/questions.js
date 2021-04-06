// ██████╗ ██╗   ██╗███████╗███████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// ██║   ██║██║   ██║█████╗  ███████╗   ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ╚██████╔╝╚██████╔╝███████╗███████║   ██║   ██║╚██████╔╝██║ ╚████║███████║
//  ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * File: questions.js
 * Author: Tommy Gingras
 * Date: 2018-24-05
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
    name: "moduleName",
    type: "input",
    message: "Module name:",
    validate: function(input) {
      if (/^([A-Za-z])+$/.test(input)) {
        return true;
      }
      return "The module name may only include letters";
    }
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
    name: "apiVersion",
    type: "input",
    message: "Backend API Version:",
    default: cache.apiVersion || "v1"
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
