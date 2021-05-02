/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const { UploadFile } = require('../../validators/index');

const logDebug = (message) => (process.env.debug ? console.debug(message) : null);

/**
 * Default upload action
 * It allows to use this module quickly
 * @param {String} filename The file name
 * @returns {Promise<String>}
 */
const upload = async (filename) =>
  // If any error occured,
  // by doing this you we will be able to delete the file
  // if (error) {
  //   // if something went wrong,
  //   DeleteFile(filename);
  //   throw new Error("An error occured !");
  // }

  // Default function to upload file.
  Promise.resolve(`file '${filename}' uploaded !`);
/**
 * Default upload route
 * It allows to use this module quickly
 * @param {Object} opts The configuration
 * @param {Function} uploadFn Custom upload action : uploadFn(filename)(req)=>{return Promise<Any>}
 * @param {Object} log Custom logger, by default : console
 */
const uploadRoute = (opts, uploadFn = null, log = console) => async (req, res) => {
  try {
    const success = [];
    let errors = [];
    const { fileProcessed, fileErrored } = await UploadFile(opts, req.files, req.files[opts.express.key].name, opts.label);

    logDebug(`${fileProcessed.length} file(s) to process`);
    logDebug(`${fileErrored.length} file(s) are invalid`);
    errors = [...fileErrored];
    for await (const filename of fileProcessed) {
      logDebug(`Processing ${filename}`);
      if (!filename) {
        log.error('File not uploaded !');
        return res.status(422).json({ message: 'File not uploaded !' });
      }

      const data = await (uploadFn ? uploadFn(filename)(req) : upload(filename)).catch((e) => {
        log.error(e.message);
        errors.push({ message: 'File unprocessable !', error: e.message });
      });

      if (data) {
        success.push({ message: 'file uploaded !', name: filename, data });
      } else {
        errors.push({ message: 'File unprocessable !', error: `${filename} not uploaded` });
      }
    }

    if (errors.length > 0) {
      return res.status(422).json({ errors, success });
    }

    return res.status(200).json({ errors, success });
  } catch (e) {
    log.error(e);
    return res.status(422).json({ message: 'File unprocessable !', error: e });
  }
};

module.exports = { upload, uploadRoute };
