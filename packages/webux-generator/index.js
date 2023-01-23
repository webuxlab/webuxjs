#!/usr/bin/env node
/* eslint-disable no-console */

//
// ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
// ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
// ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
// ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
// ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
// ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-05-24
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const path = require('path');

console.log('██╗    ██╗███████╗██████╗ ██╗   ██╗██╗  ██╗    ██╗      █████╗ ██████╗ ');
console.log('██║    ██║██╔════╝██╔══██╗██║   ██║╚██╗██╔╝    ██║     ██╔══██╗██╔══██╗');
console.log('██║ █╗ ██║█████╗  ██████╔╝██║   ██║ ╚███╔╝     ██║     ███████║██████╔╝');
console.log('██║███╗██║██╔══╝  ██╔══██╗██║   ██║ ██╔██╗     ██║     ██╔══██║██╔══██╗');
console.log('╚███╔███╔╝███████╗██████╔╝╚██████╔╝██╔╝ ██╗    ███████╗██║  ██║██████╔╝');
console.log(' ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚═════╝ ');

const option = process.argv.splice(3)[0];
const action = process.argv.splice(2)[0];

if (
  action &&
  option &&
  action === 'generate' &&
  (option === 'app' || option === 'app-v2' || option === 'module' || option === 'resource' || option === 'model')
) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, 'generator', option));
  } catch (e) {
    console.error(`\x1b[31m${e}\x1b[0m`);
  }
}

console.log('Version : ' + require('./package.json')['version']);
console.log('Usage:');
console.log('npm run generate-app');
console.log('npm run generate-app-v2');
console.log('npm run generate-module');
console.log('npm run generate-resource');
console.log('npm run generate-model');
console.log('Or Globally');
console.log('webux generate app');
console.log('webux generate app-v2');
console.log('webux generate module');
console.log('webux generate resource');
console.log('webux generate model');
