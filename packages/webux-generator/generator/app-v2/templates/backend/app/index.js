/* eslint-disable global-require */
/**
 * File: index.js
 * Author: Studio Webux
 * Date: 2021-02-17
 * License: MIT
 */

const Webux = require("@studiowebux/app");

const path = require("path");
const express = require("express");

const app = express();

// External Modules
const WebuxServer = require("@studiowebux/server");
const WebuxRoute = require("@studiowebux/route");
const WebuxSQL = require("@studiowebux/sql");
const WebuxSocket = require("@studiowebux/socket");
const WebuxLogger = require("@studiowebux/logger");
const WebuxFileupload = require("@studiowebux/fileupload");
const WebuxSecurity = require("@studiowebux/security");

class MyApp extends Webux.WebuxApp {
  constructor() {
    super();

    /**
     * The express application
     */
    this.express = express;
    this.router = express.Router();
    this.app = app;
  }

  Initialize() {
    this.log.debug("[] Initialize Application");

    this.QueryParser = WebuxSecurity.QueryParser;

    /**
     * Load all configurations
     */
    this.config = this.LoadConfiguration(path.join(__dirname, "..", "config"));

    /**
     * Load all Modules and Variables
     */
    this.helpers = this.LoadModule(
      path.join(__dirname, "..", "api", "v1", "helpers")
    );

    this.constants = this.LoadModule(
      path.join(__dirname, "..", "api", "v1", "constants")
    );

    /**
     * Webux Logger
     */
    this.Logger = new WebuxLogger(this.config.logger);
    this.log = this.Logger.CreateLogger();

    /**
     * Configure the i18n implementation
     */
    this.ConfigureLanguage();

    /**
     * Webux Server
     */
    this.Server = new WebuxServer(this.config.server, this.app, this.log);

    /**
     * Webux Routes and resources
     */
    this.Route = new WebuxRoute(this.config.routes, this.log);

    /**
     * Webux SQL
     */
    this.db = new WebuxSQL(this.config.sql, this.log);

    /**
     * Webux Socket.IO
     */
    this.Socket = new WebuxSocket(this.config.socket, null, this.log);

    /**
     * Webux File Upload
     */
    this.FileUpload = new WebuxFileupload(this.config.fileupload, this.log);

    /**
     * Webux Security
     */
    this.Security = new WebuxSecurity(this.config.security, this.log);
    this.Validators = this.Security.validators;

    // Custom modules
    // ...

    this.log.debug("[x] Application Initialized");
  }
}

module.exports = new MyApp();
