/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux 2015-Present
 */

const { fileUploadMiddleware } = require('./express/index');
const SocketIOFileUpload = require('./socketIO/index');
const { UploadFile, DeleteFile, ProcessImage } = require('./validators/index');
const { downloadRoute } = require('./express/routes/download');
const { uploadRoute } = require('./express/routes/upload');
const { securePath } = require('./utils/secure');
const { saveToObjectStorage, initObjectStorageClient } = require('./objectStorage');

/**
 * @class fileupload
 */
class FileUpload {
  /**
   * Initializes the fileupload module
   * @param {Object} opts The configuration
   * @param {Object} log Custom logger, by default : console
   */
  constructor(opts, log = console) {
    this.config = opts;
    if (this.config.socketIO) {
      this.config.socketIO.dir = opts.destination;
    }

    this.log = log;

    // Object Storage
    this.client = null;
  }

  /**
   * The middleware to use the file upload with express routes
   * @returns {Function} Express middleware
   */
  OnRequest() {
    return fileUploadMiddleware(this.config.express);
  }

  /**
   * The socket io functions
   * @returns {Function} The function to use with 'io.of("upload").on("connection", * this function  *);'
   */
  SocketIO() {
    return SocketIOFileUpload(this.config, this.log);
  }

  /**
   * To download uploaded file using express route
   * (Instead of using the static resources)
   * @param {Function} downloadFn The download function logic
   * @returns {Function} An express route function
   */
  DownloadRoute(downloadFn = null) {
    return downloadRoute(this.config.tmp, this.config.express.key, downloadFn, this.log);
  }

  /**
   * To upload a file with express
   * @param {Function} uploadFn The upload function logic
   * @returns {Function} An express route function
   */
  UploadRoute(uploadFn = null) {
    console.log('UploadRoute');
    return uploadRoute(this.config, uploadFn, this.log);
  }

  /**
   * It prepares the files to be uploaded correctly
   * @param {Object} files The files array from the user input (req.files)
   * @param {String} filename The filename (req.files[key].name)
   * @param {string} label The identifier to be added at the end of the file (optional label to append)
   * @returns {Promise<String>}  The filename
   */
  UploadFile(files, filename, label) {
    return UploadFile(this.config, files, filename, label, this.log);
  }

  /**
   * It deletes an uploaded file
   * @param {String} filepath The file path to be deleted
   * @returns {Promise}
   */
  DeleteFile(filepath) {
    return DeleteFile(filepath);
  }

  /**
   * It processes an uploaded image
   * To resize images except gif
   * @param {String} filename The uploaded filename
   * @param {String} extension The file extension
   * @param {Object|String} file The file to upload (the actual file) or a path to the uploaded file
   * @param {String} realFilename The final file name (where the file will be stored after processing)
   * @returns {Promise<String>} the final filename
   */
  ProcessImage(filename, extension, file, realFilename) {
    return ProcessImage(this.config.tmp, filename, extension, file, this.config.width, realFilename);
  }

  SecurePath(startsWith, pathToVerify) {
    return securePath(startsWith, pathToVerify, this.log);
  }

  InitObjectStorageClient() {
    this.client = initObjectStorageClient(this.config, this.log);
  }

  SaveToObjectStorage(input) {
    return saveToObjectStorage(this.client, input, this.log);
  }
}

module.exports = FileUpload;
