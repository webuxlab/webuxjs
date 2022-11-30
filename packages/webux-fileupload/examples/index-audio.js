const express = require('express');

const app = express();
const socketIO = require('socket.io')();
const path = require('path');
const cors = require('cors');
const mime = require('mime');

const { copyFileSync } = require('fs');

const WebuxFileupload = require('../src/index');

const opts = {
  sanitizeFilename: (filename) => {
    console.log(filename);

    return Promise.resolve(filename.split('').reverse().join(''));
  },
  destination: path.join(__dirname, './uploads'), // used for both
  tmp: path.join(__dirname, './.tmp'),
  mimeTypes: ['audio/wav', 'audio/wave', 'audio/vnd.wave', 'audio/x-wav'],
  filetype: 'audio',
  label: '-demo',
  express: {
    limits: {
      fileSize: '1024*1024*10',
    },
    abortOnLimit: true,
    safeFileNames: true,
    key: 'file',
  },
  socketIO: {
    mode: '0666',
    maxFileSize: null,
  },
};
// Optional upload validtor for Socket.IO
opts.uploadValidator = function (event, callback) {
  // asynchronous operations allowed here; when done,
  if (opts.mimeTypes.includes(mime.getType(path.extname(event.file.name)))) {
    callback(true);
  } else {
    callback(false);
  }
};

app.use('/public', express.static(opts.destination));

app.use(cors());

const webuxFileupload = new WebuxFileupload(opts);

app.post('/defaultupload', webuxFileupload.OnRequest(), webuxFileupload.UploadRoute());

const uploadFn = (filename) => (req) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('> Using custom upload function');
      console.log(`> POST ${filename}`);

      // This function can be use to get data from the database
      // or other actions

      copyFileSync(filename, `${opts.destination}/${filename.split('/').reverse()[0]}`);
      await webuxFileupload.DeleteFile(filename);

      // Returns true if the file can be uploaded
      return resolve(true);
    } catch (e) {
      return reject(e);
    }
  });

app.post('/upload', webuxFileupload.OnRequest(), webuxFileupload.UploadRoute(uploadFn));

const blockUpload = (filename) => (req) =>
  new Promise(async (resolve, reject) => {
    console.log('> Using custom upload function and block the transaction');
    console.log(`> POST ${filename}`);

    // This function can be use to get data from the database
    // or other actions
    console.log(filename);
    await webuxFileupload.DeleteFile(filename).catch((e) => reject(e.message));

    return reject(new Error('You are not authorized to upload files'));
  });

app.post('/blockupload', webuxFileupload.OnRequest(), webuxFileupload.UploadRoute(blockUpload));

const downloadFn = () => (req) =>
  new Promise((resolve, reject) => {
    console.log('> Using custom download function');
    console.log(`> GET ${webuxFileupload.config.destination}/${req.params[opts.express.key]}`);

    // This function can be use to get data from the database
    // or other actions

    // Returns the path to the file
    return resolve(path.join(webuxFileupload.config.destination, req.params[opts.express.key]));
  });

app.get('/download/:file', webuxFileupload.DownloadRoute(downloadFn));

app.get('/defaultdownload/:file', webuxFileupload.DownloadRoute());

const server = app.listen(1340, () => {
  console.log('Server listening on port 1340');
});

const io = socketIO.listen(server);

// default namespace
io.on('connection', (socket) => {
  console.log(`'Default' > Hello - ${socket.id}`);

  socket.on('disconnect', (e) => {
    console.log(`'Default' > Bye Bye ${socket.id}`);
    console.log(e);
  });
});

// upload namespace
io.of('upload').on('connection', webuxFileupload.SocketIO());
