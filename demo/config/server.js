/* eslint-disable global-require */
module.exports = {
  ssl: {
    enabled: !!(process.env.KEY && process.env.CERT),
    key: process.env.KEY,
    cert: process.env.CERT,
  },
  enterprise: 'Your Company',
  author: 'Your Name',
  project: 'Your Project Name',
  service: 'Your Service Name',
  version: require('../package.json').version,
  endpoint: '/api/v1',
  port: process.env.PORT || 1337,
  cores: 1,
};
