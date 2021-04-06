// █████╗ ██████╗ ██████╗
// ██╔══██╗██╔══██╗██╔══██╗
// ███████║██████╔╝██████╔╝
// ██╔══██║██╔═══╝ ██╔═══╝
// ██║  ██║██║     ██║
// ╚═╝  ╚═╝╚═╝     ╚═╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-07-13
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

 // This default configuration includes everything that been made.
 // You can update this file as you need.

"use strict";

const path = require("path");
const Webux = require("@studiowebux/app");

/**
 * It initializes the application.
 * @returns {Function} The webux object
 */

async function LoadApp() {
  Webux.LoadResponses();

  Webux.LoadConstants(path.join(__dirname, "..", "api", "v1", "constants"));

  Webux.LoadValidators(path.join(__dirname, "..", "api", "v1", "validations"));

  Webux.LoadConfiguration(path.join(__dirname, "..", "config"));

  await Webux.InitLogger();

  await Webux.InitDB();

  await Webux.LoadModels();

  if (Webux.config.seed.enabled) {
    await Webux.LoadSeed();
  }

  Webux.OnRequest();

  Webux.OnResponse();

  await Webux.LoadSecurity();

  Webux.LoadLanguage();

  await Webux.LoadLimiters();

  await Webux.LoadStaticResources();

  await Webux.LoadRoutes();

  await Webux.LoadGlobalErrorHandler();

  await Webux.InitServer();

  await Webux.InitSocket();

  Webux.log.info("Application Ready !");
}

module.exports = LoadApp;
