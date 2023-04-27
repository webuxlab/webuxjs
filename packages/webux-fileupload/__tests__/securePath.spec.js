const path = require('path');
const { securePath } = require('../src/utils/secure');

securePath(path.resolve('./public'), path.resolve('../../../hehe'));
securePath(path.resolve('./public'), path.resolve('./hehe'));
securePath(path.resolve('./public'), path.resolve('./public/hehe'));
securePath(path.resolve('./public'), path.resolve('./public/test/hehe'));
securePath(path.resolve('./public'), path.resolve('../public/hello'));
securePath(path.resolve('./public'), path.resolve('./public/../../public/hello'));
