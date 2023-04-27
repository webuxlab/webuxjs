// ██████╗ ██╗   ██╗███████╗███████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// ██║   ██║██║   ██║█████╗  ███████╗   ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ╚██████╔╝╚██████╔╝███████╗███████║   ██║   ██║╚██████╔╝██║ ╚████║███████║
//  ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

/**
 * File: questions.js
 * Author: Tommy Gingras
 * Date: 2020-01-21
 * License: All rights reserved Studio Webux 2015-Present
 */

const path = require('path');
const { readCache } = require('../lib/cache');

let currentPath = process.cwd();

// if the user has not provide the backend path, otherwise let the path as is.
if (currentPath.indexOf('backend') < 0) {
  currentPath = path.join(currentPath, 'backend');
}

const cache = readCache('cache.txt');

const questions = [
  {
    name: 'resourceName',
    type: 'input',
    message: 'Resource name:',
    validate(input) {
      if (/^([A-Za-z])+$/.test(input)) {
        return true;
      }
      return 'The resource name may only include letters';
    },
  },
  {
    name: 'resourceFolder',
    type: 'input',
    message: 'Resource Folder (if any):',
    validate(input) {
      if (/^([A-Za-z])+$/.test(input) || input === '') {
        return true;
      }
      return 'The folder name may only include letters';
    },
  },
  {
    name: 'method',
    type: 'list',
    message: 'Method:',
    choices: ['get', 'post', 'patch', 'put', 'delete', 'option'],
  },
  {
    name: 'author',
    type: 'input',
    message: 'Author name:',
    default: cache.author || '',
  },
  {
    name: 'license',
    type: 'input',
    message: 'License:',
    default: cache.license || '',
  },
  {
    name: 'backendDir',
    type: 'input',
    message: 'Backend Directory:',
    default: cache.backendDir || path.join(currentPath),
  },
  {
    name: 'apiVersion',
    type: 'input',
    message: 'Backend API Version:',
    default: cache.apiVersion || 'v1',
  },
  {
    name: 'validation',
    type: 'input',
    message: 'Is it OK ? (Y/N):',
    default: 'Y',
  },
];

module.exports = {
  questions,
};
