import path from 'node:path';
import { securePath } from '../src/utils/secure.js';

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
