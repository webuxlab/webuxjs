const gremlin = require('gremlin');

module.exports = {
  url: "'ws://localhost:8182/gremlin'",
  options: {
    authenticator: new gremlin.driver.auth.PlainTextSaslAuthenticator('myuser', 'mypassword'),
    // See: https://tinkerpop.apache.org/docs/current/reference/#gremlin-javascript for all options
  },
};
