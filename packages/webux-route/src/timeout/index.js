// /**
//  * File: index.js
//  * Author: Tommy Gingras
//  * Date: 2023-03-23
//  * License: All rights reserved Studio Webux 2015-Present
// Based on : https://github.com/expressjs/timeout Thanks !
//  */

const onFinished = require('on-finished');
const onHeaders = require('on-headers');

const onTimeout = (delay, errorHandler, cb) => () => {
  cb(
    errorHandler(503, 'Request timeout', {
      timeout: delay,
    }),
  );
};

const timeout = (delay, errorHandler) => (req, res, next) => {
  const id = setTimeout(() => {
    req.timedout = true;
    res.timedout = true;
    if (res.locals.controller) {
      res.locals.controller.abort();
    }
    req.emit('timeout', delay);
  }, delay);

  req.on('timeout', onTimeout(delay, errorHandler, next));

  req.clearTimeout = () => {
    clearTimeout(id);
  };

  req.timedout = false;
  res.timedout = false;

  onFinished(res, () => {
    clearTimeout(id);
  });

  onHeaders(res, () => {
    clearTimeout(id);
  });

  next();
};

module.exports = { timeout };
