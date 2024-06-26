/**
 * File: index.js
 * Author: Studio Webux
 * Date: 2024-04-20
 * License: MIT
 */

import { requestCounterMiddleware, tracing_v2 } from '@studiowebux/telemetry';
tracing_v2({
  trace: { url: process.env.TRACE_URL },
  metric: { url: process.env.METRIC_URL },
});

import Webux, { WebuxApp } from '@studiowebux/app';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';

const app = express();

// External Modules
import WebuxServer from '@studiowebux/server';
import WebuxRoute from '@studiowebux/route';
import WebuxSQL from '@studiowebux/sql';
import WebuxSocket from '@studiowebux/socket';
import WebuxLogger from '@studiowebux/logger';
import WebuxFileupload from '@studiowebux/fileupload';
import WebuxSecurity from '@studiowebux/security';
import WebuxView from '@studiowebux/view';
import WebuxAuth from '@studiowebux/auth';
import WebuxInMemory from '@studiowebux/inmemory';
import { Telemetry, metricsMiddleware } from '@studiowebux/telemetry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MyApp extends WebuxApp {
  constructor() {
    super();

    /**
     * The express application
     */
    this.express = express;
    this.router = express.Router();
    this.app = app;
  }

  async Initialize() {
    this.log.debug('[] Initialize Application');

    this.QueryParser = WebuxSecurity.QueryParser;

    /**
     * Load all configurations
     */
    this.config = await this.LoadConfiguration(path.join(__dirname, '..', 'config'));

    /**
     * Telemetry
     */
    this.telemetry = new Telemetry(this.config.telemetry);
    this.metrics = {
      metricsMiddleware,
      requestCounterMiddleware,
    };

    /**
     * Load all Modules and Variables
     */
    this.helpers = this.LoadModule(path.join(__dirname, '..', 'api', 'v1', 'helpers'));

    this.constants = this.LoadModule(path.join(__dirname, '..', 'api', 'v1', 'constants'));

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
     * Webux Security
     */
    this.Security = new WebuxSecurity(this.config.security, this.log);
    this.Validators = this.Security.validators;

    /**
     * Load Authentication Module
     */
    this.auth = new WebuxAuth(this.config.auth, this.log);

    /**
     * Webux Routes and resources
     */

    this.Route = new WebuxRoute(this.config.routes(this), this.log);

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
     * Webux View
     */
    this.View = new WebuxView(this.config.view, this.log);

    /**
     * Webux InMemory
     */
    this.setApiKeyStore = new WebuxInMemory(this.config.inmemory.api_key, this.log);
    this.getApiKeyStore = new WebuxInMemory(this.config.inmemory.api_key_read_only, this.log);

    // Custom modules
    // ...

    this.log.debug('[x] Application Initialized');
  }
}

export default new MyApp();
