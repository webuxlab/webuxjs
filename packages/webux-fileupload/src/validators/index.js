/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const mime = require("mime");
const imageType = require("image-type");
const fileType = require("file-type");
const ErrorHandler = require("../defaults/errorHandler");

/**
 * It deletes the file pass in parameter.
 * @param {String} filepath The full path to the file
 * @returns {Promise} Returns a promise
 */
const DeleteFile = (filepath) => {
  return new Promise((resolve, reject) => {
    // Check if the file is present
    fs.stat(filepath, (err) => {
      if (err) {
        return reject(err);
      }
      // The file is present, delete it.
      fs.unlink(filepath, (err) => {
        if (err) {
          return reject(err);
        }
        // The file has been deleted succesfully.
        return resolve();
      });
    });
  });
};

/**
 * It moves a file
 * @param {Object} file The current file (an object)
 * @param {String} destination The destination to move the file
 * @returns {Promise}
 */
function moveFile(file, destination) {
  return new Promise((resolve, reject) => {
    file.mv(destination, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

/**
 * Using sharp to process the picture
 * Currently only the resize is supported for non gif images
 * @param {Integer} width The picture width
 * @param {String} filename Temporary filename
 * @param {String} realFilename Final filename
 * @returns {Promise<String>} Returns the final filename
 */
async function PostProcessing(width, filename, realFilename) {
  return new Promise((resolve, reject) => {
    sharp(filename)
      .resize(width)
      .toFile(realFilename, async (err) => {
        if (err) {
          return reject(err);
        }

        // Delete the temporary file
        await DeleteFile(filename).catch((e) => {
          return reject(e);
        });

        return resolve(realFilename);
      });
  });
}

/**
 * To resize images except gif
 * @param {String} tmpDirectory The absolute path to store the file temporarily
 * @param {String} filename The uploaded filename
 * @param {String} extension the file extension
 * @param {Object|String} file The file to upload (the actual file) or a path to the uploaded file
 * @param {Integer} width The width of the picture
 * @param {String} realFilename The final file name (where the file will be stored after processing)
 * @returns {Promise<String>} the final filename
 */
async function ProcessImage(
  tmpDirectory,
  filename,
  extension,
  file,
  width,
  realFilename
) {
  // If the image is not a GIF.
  // We can't resize a gif.
  if (extension !== "gif") {
    const TMPfilename = path.join(tmpDirectory, filename);

    if (typeof file === "object") {
      await moveFile(file, TMPfilename).catch((err) => {
        return Promise.reject(err);
      });
    } else {
      // Move the file using the filepath
      fs.renameSync(file, TMPfilename);
    }

    await PostProcessing(width, TMPfilename, realFilename);
  } else {
    // This image is a gif, move it directly
    if (typeof file === "object") {
      await moveFile(file, realFilename).catch((err) => {
        return Promise.reject(err);
      });
    } else {
      // Using the socket.IO implementation
      // nothing is required. the file is already in the destination directory
      fs.renameSync(file, realFilename);
    }
  }
  return Promise.resolve(realFilename);
}

/**
 * It checks if the file is valid to be stored on the server.
 * Only used with the express file upload.
 * @param {Object} options The options object
 * @param {Object} files The files array from the user input
 * @param {String} filename The filename
 * @param {string} label The identifier to be added at the end of the file
 * @returns {Promise<String>} The filename
 */
const UploadFile = (options, files, filename, label = "") => {
  return new Promise(async (resolve, reject) => {
    // req.files.KEY
    const _files = files[options.express.key];

    // Check if the current mimetype is in the options
    if (options.mimeTypes.includes(_files.mimetype)) {
      const extension = mime.getExtension(_files.mimetype);

      const updatedFilename =
        (options.sanitizeFilename
          ? await options.sanitizeFilename(filename)
          : filename) +
        label +
        "." +
        extension;

      const uploadDestination = path.join(options.destination, updatedFilename);
      const uploadTempDestination = path.join(options.tmp, updatedFilename);

      // If the uploaded file is an image
      // We can use sharp to resize it.
      if (
        options.filetype === "image" &&
        imageType(_files.data) &&
        options.mimeTypes.includes(imageType(_files.data).mime)
      ) {
        await ProcessImage(
          options.tmp,
          updatedFilename,
          extension,
          _files,
          options.width,
          uploadDestination
        );
      } else {
        const info = await fileType.fromBuffer(_files.data);

        if (!info || !options.mimeTypes.includes(info.mime)) {
          // await DeleteFile(_files.name);

          return reject(
            ErrorHandler(422, "Invalid Mime Type", {
              reason: `Received ${info.mime}, not in ${options.mimeTypes}`,
            })
          );
        } else {
          // The file is not an image, it can be a document or something else,
          // Move the file directly to the temporary file to let the user 
          // move it in the wanted directory
          // That way it is possible to apply some post processing on the file
          await moveFile(_files, uploadTempDestination).catch((err) => {
            return reject(err);
          });
        }
      }
      return resolve(uploadTempDestination);
    } else {
      return reject(
        ErrorHandler(422, "Invalid Mime Type", {
          reason: `Received ${_files.mimetype}, not in ${options.mimeTypes}`,
        })
      );
    }
  });
};

module.exports = { UploadFile, DeleteFile, PostProcessing, ProcessImage };
