const path = require('path');

module.exports = {
  recursionAllowed: true,
  ignoreFirstDirectory: true,
  namespaces: {
    default: [path.join(__dirname, '..', 'api', 'v1', '_ReservedEvents', 'connect.js'), path.join(__dirname, '..', 'api', 'v1', 'actions')],
  },
};
