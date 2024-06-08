import gremlin from 'gremlin';

export default {
  url: "'ws://localhost:8182/gremlin'",
  // See: https://tinkerpop.apache.org/docs/current/reference/#gremlin-javascript for all options
  options: {
    authenticator: new gremlin.driver.auth.PlainTextSaslAuthenticator('myuser', 'mypassword'),
  },
};
