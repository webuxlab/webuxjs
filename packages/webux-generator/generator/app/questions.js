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
 * License: All rights reserved Studio Webux 2015-Present
 */

const path = require('path');

const currentPath = process.cwd();

const questions = [
  {
    name: 'projectName',
    type: 'input',
    message: 'Project Name:',
    default: 'new-project',
    validate(input) {
      if (/^([A-Za-z-])+$/.test(input)) {
        return true;
      }
      return 'The module name may only include letters or dashes';
    },
  },
  {
    name: 'projectDescription',
    type: 'input',
    message: 'Project Description:',
    default: 'A new WebuxJS Project',
  },
  {
    name: 'projectAuthor',
    type: 'input',
    message: 'Project Author:',
    default: 'You',
  },
  {
    name: 'templatePath',
    type: 'input',
    message: 'Template Directory:',
    default: path.join(__dirname, 'templates'),
  },
  {
    name: 'projectDirectory',
    type: 'input',
    message: 'Project Directory:',
    default: path.join(currentPath),
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
