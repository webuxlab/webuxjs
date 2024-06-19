/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux 2015-Present
 */

import path from 'node:path';

/**
 * The default download action
 * It allows to use this module quickly
 * @param {String} filename The filename to retrieve
 * @param {String} destination The base path where the file is stored
 * @returns {Promise<String>} The file path
 */
// Default function to get started quickly
const download = (filename, destination) => Promise.resolve(path.join(destination, filename));
/**
 * Default download route
 * It allows to use this module quickly
 * @param {String} destination The file location '/path/to/'
 * @param {String} key The query key to find the filename 'req.params[key]'
 * @param {Function} downloadFn Custom action: downloadFn(destination)(req)=>{return Promise<String>}
 * @param {Object} log Custom logger, by default : console
 */
export const downloadRoute =
  (destination, key = 'id', downloadFn = null, log = console) =>
  async (req, res) => {
    try {
      const pictureURL = await (downloadFn ? downloadFn(destination)(req) : download(req.params[key], destination));

      if (!pictureURL) {
        log.error(`Image not Found - ${pictureURL}`);
        return res.status(404).json({ message: 'Image not found !' });
      }

      return res.sendFile(path.resolve(pictureURL), (err) => {
        if (err) {
          log.error(err);
          res.status(422).json({ message: 'File unprocessable !', error: err });
        }
      });
    } catch (e) {
      log.error(e);
      return res.status(422).json({ message: 'File unprocessable !', error: e });
    }
  };
