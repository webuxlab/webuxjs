const path = require('path');
const mime = require('mime');

const opts = {
  sanitizeFilename: (filename) => Promise.resolve(filename),
  destination: path.join(__dirname, '..', 'public'),
  tmp: path.join(__dirname, '..', '.tmp'),
  mimeTypes: [
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/webp',
  ],
  width: 200,
  filetype: 'image',
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

opts.uploadValidator = function (event, callback) {
  // asynchronous operations allowed here; when done,
  if (opts.mimeTypes.includes(mime.getType(path.extname(event.file.name)))) {
    callback(true);
  } else {
    callback(false);
  }
};

module.exports = opts;