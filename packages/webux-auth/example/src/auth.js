const WebuxAuth = require('../../../webux-auth/src/index.js');
const config = require("./config")

module.exports = new WebuxAuth(config, console); // FIXME: There is coupling :cry:
