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

webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "constants"),
  "constants"
);
webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "validations"),
  "validations"
);
webuxApp.LoadModule(path.join(__dirname, "api", "v1", "helpers"), "helpers");
webuxApp.LoadModule(
  path.join(__dirname, "api", "v1", "middlewares"),
  "middlewares"
);

console.log(webuxApp.constants);
console.log(webuxApp.helpers);
console.log(webuxApp.middlewares);
console.log(webuxApp.validations);

console.log(webuxApp.IdToURL(123, "user", "https://myapp.webuxlab.com/api/v1"));

let users = [
  { _id: "12345abc22...", name: "test" },
  { _id: "12345abc23...", name: "test2" },
  { _id: "12345abc24...", name: "test3" },
];
console.log(webuxApp.ToObject(users));

module.exports = webuxApp;
