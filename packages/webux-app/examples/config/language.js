const path = require("path");

module.exports = {
  availables: ["fr", "en"],
  directory: path.join(__dirname, "..", "locales"),
  default: "en",
  autoReload: true,
  syncFiles: true,
};
