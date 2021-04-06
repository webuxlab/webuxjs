const path = require("path");

const WebuxApp = require("../../src/index");
const app = require("express")();

let webuxApp = new WebuxApp({
  configuration: path.join(__dirname, "..", "config"),
});

/**
 * The express application
 */
webuxApp.app = app;


webuxApp.LoadConfiguration();
webuxApp.ConfigureLanguage();

module.exports = webuxApp;
