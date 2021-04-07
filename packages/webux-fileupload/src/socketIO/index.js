/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const SocketIOFileUpload = require('socketio-file-upload');
const ss = require('socket.io-stream');
const fs = require('fs');
const path = require('path');
const readChunk = require('read-chunk');
const imageType = require('image-type');
const fileType = require('file-type');
const { ProcessImage, DeleteFile } = require('../validators/index');

// eslint-disable-next-line no-console
const logDebug = (message) => (process.env.debug ? console.debug(message) : null);

// Configuration
// https://github.com/sffc/socketio-file-upload

/**
 * It configures the socket.IO uploader
 * It configures the socket.IO download
 * @param {Object} opts The full path to the file
 * @param {Object} log Custom logger, by default : console
 * @returns {Function<Object>} It returns a function to be use with 'io.of("upload").on("connection", * this function * );'
 */
module.exports = (opts, log = console) => (socket) => {
  // log.debug("'upload' > Hello - " + socket.id);

  socket.on('disconnect', (reason) => {
    // log.debug("'upload' > Bye Bye " + socket.id);
    // log.debug(reason);
    logDebug(`Disconnect ${reason}`);
  });

  // Make an instance of SocketIOFileUpload and listen on this socket:
  const uploader = new SocketIOFileUpload(opts.socketIO);

  uploader.listen(socket);

  // Simple validation to prevent unwanted file upload,
  // But we also do the validation at the completion
  // and check the file header
  if (opts.uploadValidator) {
    uploader.uploadValidator = opts.uploadValidator;
  }

  // Do something when a file is saved:
  uploader.on('saved', (event) => {
    // log.debug("saved");
    // log.debug(event);
    logDebug(`Saved ${event}`);
  });

  // Do something when a file start to upload:
  uploader.on('start', (event) => {
    // log.debug("Start");
    // log.debug(event);
    logDebug(`Start ${event}`);
  });

  // Do something when a file is in progress:
  uploader.on('progress', (event) => {
    // log.debug("progress");
    // log.debug(event);
    logDebug(`Progress ${event}`);
  });

  // Do something when a file is complete:
  uploader.on('complete', async (event) => {
    // log.debug("complete");
    // log.debug(event);
    logDebug(`Complete ${event}`);

    const buffer = readChunk.sync(event.file.pathName, 0, 12);
    const info = imageType(buffer);
    // log.debug(info);

    const finalPath = path.join(
      opts.destination,
      (opts.sanitizeFilename ? await opts.sanitizeFilename(event.file.base) : event.file.base) +
        opts.label +
        path.extname(event.file.pathName),
    );

    if (opts.filetype === 'image' && info && opts.mimeTypes.includes(info.mime) > -1) {
      if (!opts.mimeTypes.includes(info.mime)) {
        socket.emit('uploadError', { message: 'Invalid mime type' });
      } else {
        await ProcessImage(opts.tmp, event.file.name, info.ext, event.file.pathName, opts.width, finalPath);
      }
    } else {
      const fileBuffer = readChunk.sync(event.file.pathName, 0, 4100);

      const fileTypeinfo = await fileType.fromBuffer(fileBuffer);

      if (!fileTypeinfo || !opts.mimeTypes.includes(fileTypeinfo.mime)) {
        await DeleteFile(event.file.pathName);

        socket.emit('uploadError', { message: 'Invalid mime type' });
      } else {
        fs.renameSync(event.file.pathName, finalPath);
      }
    }
  });

  // Error handler:
  uploader.on('error', (event) => {
    // log.debug("Error from uploader", event);
    logDebug(`Error ${event}`);
  });

  // eslint-disable-next-line consistent-return
  ss(socket).on('download', (stream, name, callback) => {
    const filePath = path.join(opts.destination, name.toString());

    if (!fs.existsSync(filePath)) {
      return callback(null, `The file ${name} doesn't exist`);
    }

    callback({
      name,
      size: fs.statSync(filePath).size,
    });

    const MyFileStream = fs.createReadStream(filePath);
    MyFileStream.pipe(stream);

    MyFileStream.on('end', () => {
      log.debug(`File '${name}' downloaded !`);
    });
  });
};
