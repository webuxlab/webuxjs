const WebuxApp = require("../src/index");
const path = require("path");
const options = {
  configuration: path.join(__dirname, "config"),
};

const webuxApp = new WebuxApp(options);

console.log(webuxApp.config);

console.log("---");
webuxApp.LoadConfiguration();
console.log(webuxApp.config);

console.log("+++");
webuxApp.config._manual = {
  testing: "test1",
};
console.log(webuxApp.config);
