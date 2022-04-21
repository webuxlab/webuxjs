/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mime = require('mime');
const imageType = require('image-type');
const fileType = require('file-type');
const ErrorHandler = require('../defaults/errorHandler');

const logDebug = (message) => (process.env.debug ? console.debug(message) : null);
const logVerbose = (message) => (process.env.verbose ? console.debug(message) : null);

/**
 * It deletes the file pass in parameter.
 * @param {String} filepath The full path to the file
 * @returns {Promise} Returns a promise
 */
const DeleteFile = (filepath) =>
  new Promise((resolve, reject) => {
    // Check if the file is present
    fs.stat(filepath, (statError) => {
      if (statError) {
        return reject(statError);
      }
      // The file is present, delete it.
      return fs.unlink(filepath, (unlinkError) => {
        if (unlinkError) {
          return reject(unlinkError);
        }
        // The file has been deleted succesfully.
        return resolve();
      });
    });
  });

/**
 * It moves a file
 * @param {Object} file The current file (an object)
 * @param {String} destination The destination to move the file
 * @returns {Promise}
 */
function moveFile(file, destination) {
  return new Promise((resolve, reject) => {
    logDebug(`Moving ${file.name} to ${destination}`);
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
        await DeleteFile(filename).catch((e) => reject(e));

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
async function ProcessImage(tmpDirectory, filename, extension, file, width, realFilename) {
  // If the image is not a GIF.
  // We can't resize a gif.
  if (extension !== 'gif') {
    const TMPfilename = path.join(tmpDirectory, filename);

    if (typeof file === 'object') {
      await moveFile(file, TMPfilename).catch((err) => Promise.reject(err));
    } else {
      // Move the file using the filepath
      fs.renameSync(file, TMPfilename);
    }

    await PostProcessing(width, TMPfilename, realFilename);
    return Promise.resolve(realFilename);
  }

  // This image is a gif, move it directly, no resize will be applied
  if (typeof file === 'object') {
    await moveFile(file, realFilename).catch((err) => Promise.reject(err));
  } else {
    // Using the socket.IO implementation
    // nothing is required. the file is already in the destination directory
    fs.renameSync(file, realFilename);
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
const UploadFile = (options, files, filename, label = '') =>
  new Promise(async (resolve, reject) => {
    try {
      // req.files.KEY
      const localFiles = files[options.express.key];
      let fileToProcess = [];
      const fileProcessed = [];
      const fileErrored = [];

      if (!localFiles || localFiles.length === 0) {
        return reject(new Error(`No files provided using ${options.express.key} for the key.`));
      }

      if (localFiles.length > 0) {
        fileToProcess = localFiles;
      } else {
        fileToProcess.push(localFiles);
      }

      logDebug(`Will process ${fileToProcess.length} file(s)`);
      // Process all uploaded files
      for await (const file of fileToProcess) {
        logDebug(`Processing '${file.name}' using this filename ${file.name || filename}`);
        logVerbose(file);
        // Check if the current mimetype is in the options
        if (options.mimeTypes.includes(file.mimetype)) {
          const extension = mime.getExtension(file.mimetype);

          const updatedFilename = `${
            (options.sanitizeFilename ? await options.sanitizeFilename(file.name || filename) : file.name || filename) + label
          }.${extension}`;

          const uploadDestination = path.join(options.destination, updatedFilename);
          const uploadTempDestination = path.join(options.tmp, updatedFilename);

          // If the uploaded file is an image
          // We can use sharp to resize it.
          if (options.filetype === 'image' && imageType(file.data) && options.mimeTypes.includes(imageType(file.data).mime)) {
            logDebug(`The file must be an 'image' file`);
            return ProcessImage(options.tmp, updatedFilename, extension, file, options.width, uploadDestination);
          }

          if (options.filetype === 'text' || options.filetype === 'csv') {
            logDebug(`The file must be a 'text' or a 'csv' file`);
            if (!options.mimeTypes.includes(file.mimetype)) {
              logDebug(`Invalid mimetype for ${file.name}`);

              fileErrored.push(
                ErrorHandler(422, 'Invalid Mime Type', {
                  reason: `Received '${file.mimetype}', not in [${options.mimeTypes}] for '${file.name}'`,
                }),
              );
            }
          } else {
            logDebug(`The file must be a 'binary' file`);
            const info = await fileType.fromBuffer(file.data);
            if (!info || !options.mimeTypes.includes(info.mime)) {
              // await DeleteFile(file.name);
              logDebug(`Invalid mimetype for ${file.name}`);
              fileErrored.push(
                ErrorHandler(422, 'Invalid Mime Type', {
                  reason: `Received '${file.mimetype}', not in [${options.mimeTypes}] for '${file.name}'`,
                }),
              );
            }
          }

          // The file is not an image, it can be a document or something else,
          // Move the file directly to the temporary file to let the user
          // move it in the wanted directory
          // That way it is possible to apply some post processing on the file
          await moveFile(file, uploadTempDestination).catch((err) => reject(err));
          fileProcessed.push(uploadTempDestination);
        } else {
          fileErrored.push(
            ErrorHandler(422, 'Invalid Mime Type', {
              reason: `Received '${file.mimetype}', not in [${options.mimeTypes}] for '${file.name}'`,
            }),
          );
        }
      }
      if ((!fileProcessed || fileProcessed.length === 0) && (!fileErrored || fileErrored.length === 0)) {
        return reject(new Error('An error has occured while processing uploaded files.'));
      }

      return resolve({ fileProcessed, fileErrored });
    } catch (e) {
      console.error(e.message);
      return reject(
        ErrorHandler(400, 'An error has occured', {
          reason: e.message,
        }),
      );
    }
  });

module.exports = { UploadFile, DeleteFile, PostProcessing, ProcessImage };
