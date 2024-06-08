/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-05-10
 * License: All rights reserved Studio Webux 2015-Present
 */

import SocketIOFileUpload from 'socketio-file-upload';
import ss from 'socket.io-stream';
import fs from 'node:fs';
import path from 'node:path';
import readChunk from 'read-chunk';
import imageType from 'image-type';
import fileType from 'file-type';
import { ProcessImage, DeleteFile } from '../validators/index.js';

const logDebug = (message) => (process.env.DEBUG ? console.debug(message) : null);

// Configuration
// https://github.com/sffc/socketio-file-upload

/**
 * It configures the socket.IO uploader
 * It configures the socket.IO download
 * @param {Object} opts The full path to the file
 * @param {Object} log Custom logger, by default : console
 * @returns {Function<Object>} It returns a function to be use with 'io.of("upload").on("connection", * this function * );'
 */
export default (opts, log = console) =>
  (socket) => {
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
