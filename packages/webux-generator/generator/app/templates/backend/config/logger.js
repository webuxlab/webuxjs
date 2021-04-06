const os = require("os");

module.exports = {
  application_id: os.hostname() + "_" + (process.env.APP_ID || "Application01"),
  forceConsole:
    process.env.CONSOLE && process.env.CONSOLE == "false" ? false : true,
  consoleLevel: process.env.CONSOLE_LEVEL || "silly",
  logstash: {
    host: process.env.LOGSTASH_URL || "127.0.0.1",
    port: "5000" // udp only !
  },
  filenames: {
    error: "log/error.log",
    warn: "log/warn.log",
    info: "log/info.log",
    verbose: "log/verbose.log",
    debug: "log/debug.log",
    silly: "log/silly.log"
  },
  blacklist: ["password", "authorization", "refreshToken", "accessToken"], // Please be careful !! otherwise you could log the sensitive information
  meta: {
    service: process.env.SERVICE || "Instance XyZ",
    Location: process.env.LOCATION || "Your Computer"
  }
};
