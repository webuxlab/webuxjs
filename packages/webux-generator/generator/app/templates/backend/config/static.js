const path = require("path");

module.exports = {
  resources: [
    { path: "/", resource: path.join(__dirname, "..", "apidoc") },
    { path: "/css", resource: path.join(__dirname, "..", "apidoc/css") },
    { path: "/fonts", resource: path.join(__dirname, "..", "apidoc/fonts") },
    { path: "/img", resource: path.join(__dirname, "..", "apidoc/img") },
    { path: "/locales", resource: path.join(__dirname, "..", "apidoc/locales") },
    { path: "/utils", resource: path.join(__dirname, "..", "apidoc/utils") },
    { path: "/vendor/*", resource: path.join(__dirname, "..", "apidoc/vendor") },
  ]
};
