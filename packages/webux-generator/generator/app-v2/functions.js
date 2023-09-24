/* eslint-disable no-console */
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
 * License: All rights reserved Studio Webux 2015-Present
 */

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

let slash = '/';
if (process.platform === 'win32') {
  slash = '\\';
}

const hasChildren = (files, base, parent, child, file) => {
  let filename = file ? path.join(file) : path.join(base);
  if (typeof parent[child] === 'object' && Object.keys(parent[child]).length > 0) {
    filename = path.join(filename, child);

    Object.keys(parent[child]).forEach((element) => {
      hasChildren(files, base, parent[child], element, filename);
    });
  } else {
    if (parent[child] && typeof parent[child] === 'string') {
      filename = path.join(filename, parent[child]);
    } else {
      filename = path.join(filename, child);
    }
    files.push(filename);
  }
};

async function createFile(file, templatePath, projectDirectory) {
  return new Promise((resolve, reject) => {
    let sanitizeFile = file.replace(/\.\.\//g, ''); // remove pattern '../'
    if (process.platform === 'win32') {
      sanitizeFile = file.replace(/\.\.\\/g, ''); // remove pattern '..\'
    }
    sanitizeFile = sanitizeFile.replace(templatePath, ''); // remove the template path

    fs.stat(path.join(projectDirectory, sanitizeFile), (err, exist) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else if (exist) {
        console.log(path.join(projectDirectory, sanitizeFile), `\x1b[33mFile exist\x1b[0m`);
        return resolve();
      }

      const newDir = path.join(projectDirectory, sanitizeFile);
      const dir = newDir.substr(0, newDir.lastIndexOf(slash));

      return fse.ensureDir(dir, (ensureDirErr) => {
        // if dir not exists, create it.
        if (ensureDirErr) {
          return reject(ensureDirErr);
        }

        return fse.copy(
          path.join(file), // from
          path.join(projectDirectory, sanitizeFile), // to
          (copyErr) => {
            if (copyErr) {
              reject(copyErr);
            }

            console.log(file, `\x1b[32mCopied !\x1b[0m`);
            return resolve();
          },
        );
      });
    });
  });
}

/**
 * For each required files, check if it already exist
 * Or copy it and replace the variable with the good values.
 * @param {*} files
 * @param {*} templatePath
 * @param {*} projectDirectory
 */
async function processFiles(files, templatePath, projectDirectory) {
  for await (const dest of files) {
    await createFile(dest, templatePath, projectDirectory).catch((e) => {
      throw e;
    });
  }
  console.log('done');
}

/**
 * Create the gitignore file after copied the structure.
 * @param {String} dir The project path
 */
function createGitignore(dir) {
  console.log('Create .gitignore');
  const data = 'node_modules/\nlog/\n.DS_Store\n.tmp/\ndist/\n.env*';

  return fs.writeFileSync(path.join(dir, 'backend', '.gitignore'), data);
}

module.exports = {
  hasChildren,
  processFiles,
  createGitignore,
};
