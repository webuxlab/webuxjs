/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-06-17
 * License: All rights reserved Studio Webux 2015-Present
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * To create the key name without the XX_ naming convention.
 * @param {String} moduleName
 * @return {String} name filtered
 */
function splitName(moduleName) {
  const name = moduleName.split('_');

  // Check if the part before the underscore has more than two characters
  // If so, returns only the second part
  if (name.length >= 2) {
    return name[1];
  }
  // otherwise it returns the first part
  return name[0];
}

/**
 * Load all modules within a directory and return the object containing the key/value
 * @param {String} configPath The absolute directory path, mandatory
 * @param {Function} log The log function, optional (Default: console)
 * @return {Array} The mapping of the config name and the key/values.
 */
export default async (configPath, log = console) => {
  if (configPath && typeof configPath === 'string') {
    const modules = {};
    // Get all files in the directory, process only the .js files
    try {
      const files = fs.readdirSync(configPath).sort();

      for (const file of files) {
        if (file.includes('.js')) {
          // link the configuration values with the filename.
          const configName = file.split('.js')[0];
          const processedName = splitName(configName);
          log.info(`\x1b[32mwebux-loader - Trying to load configuration : ${processedName}\x1b[0m`);

          const config = await import(path.join(configPath, file));
          modules[processedName] = config.default;
          log.info(`\x1b[32mwebux-loader - Configuration : ${processedName} loaded\x1b[0m`);
        }
      }

      // return the mapping config/name
      return modules;
    } catch (e) {
      // It can happen when the directory doesn't exist
      log.error(e);
      return {};
    }
  } else {
    throw new Error('The configPath must be a string representing the absolute path of the configuration directory.');
  }
};
