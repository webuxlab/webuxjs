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
 * License: All rights reserved Studio Webux 2015-Present
 */

const backend = {
  '.tmp': {},
  api: {
    v1: {
      _ReservedEvents: { 'connect.js': '' },
      actions: {},
      constants: {},
      helpers: {},
      middlewares: {},
      validations: {},
      plugins: { auth: { 'isAuth.js': '' } },
    },
  },
  app: {
    'index.js': '',
  },
  bin: {
    'index.js': '',
  },
  db: {
    dev: {
      migrations: {},
      seeds: {},
    },
  },
  config: {
    'auth.js': '',
    'db.js': '',
    'language.js': '',
    'limiter.js': '',
    'logger.js': '',
    'mailer.js': '',
    'request.js': '',
    'routes.js': '',
    'security.js': '',
    'seed.js': '',
    'server.js': '',
    'socket.js': '',
    'static.js': '',
    'upload.js': '',
  },
  locales: {
    'en.json': '',
    'fr.json': '',
  },
  __tests__: {},
  uploads: {},
  public: {},
  '.dockerignore': '',
  '.eslintrc.json': '',
  '.prettierrc': '',
  'jest.config.js': '',
  'babel.config.js': '',
  Dockerfile: '',
  'package.json': '',
  'license.txt': '',
  'Gruntfile.js': '',
  'README.md': '',
};

const frontend = {
  client: {
    'README.md': '',
  },
  nginx: {
    certs: {},
    'nginx.conf': '',
  },
  '.dockerignore': '',
  Dockerfile: '',
  'README.md': '',
};

module.exports = {
  backend,
  frontend,
};
