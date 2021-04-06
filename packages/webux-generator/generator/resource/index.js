// ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
// ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
// ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
// ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
// ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
// ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-01-21
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const { prompt } = require("inquirer");
const { plural } = require("pluralize");
const path = require("path");
const { processFiles, FirstLetterCap } = require("./functions");
const { updateInfo } = require("../lib/utils");
const { createCache } = require("../lib/cache");
const { updateRoute } = require("./lib/route");
const { questions } = require("./questions");
const today = new Date().toISOString().slice(0, 10);

try {
  // Ask the question to create the files.
  prompt(questions).then(answers => {
    try {
      if (answers["validation"].toLowerCase() !== "y") {
        return;
      }

      const cache = {
        apiVersion: answers["apiVersion"],
        resourceFolder: answers["resourceFolder"],
        author: answers["author"],
        license: answers["license"],
        backendDir: answers["backendDir"]
      };
      createCache(cache, "cache.txt");

      const resourceName = answers["resourceName"].toLowerCase();
      const resourceFolder = answers["resourceFolder"].toLowerCase();
      const method = answers["method"].toLowerCase();
      const author = answers["author"];
      const license = answers["license"];
      const backendDir = answers["backendDir"];
      const apiVersion = answers["apiVersion"];
      const creationDate = today;
      const modelName = FirstLetterCap(resourceName);
      const resourceFilename = resourceName + ".js";
      const testFilename = resourceName + ".spec.js";
      const plurial = plural(resourceName);

      if (!path.isAbsolute(backendDir)) {
        throw new Error("The backend directory must be an absolute path.");
      }

      const files = [
        path.join(
          backendDir,
          "api",
          apiVersion,
          "actions",
          resourceFolder,
          resourceFilename
        ),
        path.join(backendDir, "tests", "cases", testFilename),
        path.join(
          backendDir,
          "api",
          apiVersion,
          "validations",
          resourceFilename
        ),
        path.join(backendDir, "api", apiVersion, "helpers", resourceFilename),
        path.join(backendDir, "api", apiVersion, "constants", resourceFilename),
        path.join(backendDir, "defaults", resourceFilename)
      ];
      const options = {
        files: files,
        from: [
          /{{resourceName}}/g,
          /{{author}}/g,
          /{{license}}/g,
          /{{creationDate}}/g,
          /{{modelName}}/g,
          /{{resourceFilename}}/g,
          /{{plurial}}/g
        ],
        to: [
          resourceName,
          author,
          license,
          creationDate,
          modelName,
          resourceFilename,
          plurial
        ]
      };

      Promise.all([processFiles(files, resourceFolder)])
        .then(() => {
          console.log("Webux Generator - update info");
          updateInfo(options)
            .then(async () => {
              try {
                await updateRoute(
                  backendDir,
                  resourceName,
                  resourceFolder,
                  method,
                  apiVersion
                );
              } catch (error) {
                console.error(`\x1b[31m${error}\x1b[0m`);
              }
            })
            .catch(error => {
              console.error(`\x1b[31m${error}\x1b[0m`);
            });
        })
        .catch(error => {
          console.error(`\x1b[31m${error}\x1b[0m`);
        });
    } catch (e) {
      console.error(`\x1b[31m${e}\x1b[0m`);
    }
  });
} catch (e) {
  console.error(`\x1b[31m${e}\x1b[0m`);
}
