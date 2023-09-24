const path = require('path');
const { securePath } = require('../src/utils/secure');

const logger = {
  verbose: console.debug,
  debug: console.debug,
  log: console.log,
  info: console.log,
  error: console.log,
};

test('Secure Path', () => {
  securePath(path.resolve('./public'), path.resolve('../../../hehe'), logger);
  securePath(path.resolve('./public'), path.resolve('./hehe'), logger);
  securePath(path.resolve('./public'), path.resolve('./public/hehe'), logger);
  securePath(path.resolve('./public'), path.resolve('./public/test/hehe'), logger);
  securePath(path.resolve('./public'), path.resolve('../public/hello'), logger);
  securePath(path.resolve('./public'), path.resolve('./public/../../public/hello'), logger);
});
