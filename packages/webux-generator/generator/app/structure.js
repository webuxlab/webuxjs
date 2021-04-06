// ███████╗████████╗██████╗ ██╗   ██╗ ██████╗████████╗██╗   ██╗██████╗ ███████╗
// ██╔════╝╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██║   ██║██╔══██╗██╔════╝
// ███████╗   ██║   ██████╔╝██║   ██║██║        ██║   ██║   ██║██████╔╝█████╗
// ╚════██║   ██║   ██╔══██╗██║   ██║██║        ██║   ██║   ██║██╔══██╗██╔══╝
// ███████║   ██║   ██║  ██║╚██████╔╝╚██████╗   ██║   ╚██████╔╝██║  ██║███████╗
// ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝

/**
 * File: structure.js
 * Author: Tommy Gingras
 * Date: 2018-05-24
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const backend = {
  ".tmp": {},
  api: {
    v1: {
      actions: {},
      constants: {},
      helpers: {},
      middlewares: {},
      validations: {},
      plugins: { auth: { "isAuth.js": "" } }
    }
  },
  app: {
    "index.js": ""
  },
  config: {
    "auth.js": "",
    "db.js": "",
    "language.js": "",
    "limiter.js": "",
    "logger.js": "",
    "mailer.js": "",
    "request.js": "",
    "routes.js": "",
    "security.js": "",
    "seed.js": "",
    "server.js": "",
    "socket.js": "",
    "static.js": "",
    "upload.js": ""
  },
  defaults: {},
  locales: {},
  models: {},
  tests: {
    cases: {}
  },
  uploads: {},
  public: {},
  ".dockerignore": "",
  ".eslintrc.json": "",
  "jest.config.js": "",
  "index.js": "",
  Dockerfile: "",
  "package.json": "",
  "license.txt": "",
  "Gruntfile.js": "",
  "README.md": ""
};

const frontend = {
  client: {
    "README.md": ""
  },
  nginx: {
    certs: {},
    "nginx.conf": ""
  },
  ".dockerignore": "",
  Dockerfile: "",
  "README.md": ""
};

module.exports = {
  backend,
  frontend
};
