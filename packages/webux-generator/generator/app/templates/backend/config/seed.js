const path = require("path");

module.exports = {
  directory: path.join(__dirname, "..", "defaults"),
  enabled: process.env.RUN_SEED || true
};
