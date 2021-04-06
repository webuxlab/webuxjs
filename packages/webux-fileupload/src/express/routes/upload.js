/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const { UploadFile } = require("../../validators/index");

/**
 * Default upload action
 * It allows to use this module quickly
 * @param {String} filename The file name
 * @returns {Promise<String>}
 */
const upload = async (filename) => {
  // If any error occured,
  // by doing this you we will be able to delete the file
  // if (error) {
  //   // if something went wrong,
  //   DeleteFile(filename);
  //   throw new Error("An error occured !");
  // }

  // Default function to upload file.
  return Promise.resolve(`file '${filename}' uploaded !`);
};

/**
 * Default upload route
 * It allows to use this module quickly
 * @param {Object} opts The configuration
 * @param {Function} uploadFn Custom upload action : uploadFn(filename)(req)=>{return Promise<Any>}
 * @param {Object} log Custom logger, by default : console
 */
const uploadRoute = (opts, uploadFn = null, log = console) => {
  return async (req, res, next) => {
    try {
      const filename = await UploadFile(
        opts,
        req.files,
        req.files[opts.express.key].name,
        opts.label
      );

      if (!filename) {
        log.error("Image not uploaded !");
        return res.status(422).json({ message: "Image not uploaded !" });
      }

      // It should have some interaction or something like that done
      (uploadFn ? uploadFn(filename)(req) : upload(filename))
        .then((uploaded) => {
          return res
            .status(200)
            .json({ message: "file uploaded !", name: filename, uploaded });
        })
        .catch((e) => {
          log.error(e.message);
          return res
            .status(422)
            .json({ message: "Image unprocessable !", error: e.message });
        });
    } catch (e) {
      log.error(e);
      return res
        .status(422)
        .json({ message: "Image unprocessable !", error: e });
    }
  };
};

module.exports = { upload, uploadRoute };
