// npx knex migrate:latest
// node index.js
import WebuxAuth from '../../src/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import config from './knexfile.js';
import knex from 'knex';

const conn = knex(config.development);

const auth = new WebuxAuth({
  session: { express_session_secret: 'shhh', resave: false, save_uninitialized: true, cookie: { secure: false } },
  local: { redirect_url: '/login', redirect_home: '/home' },
});

const SALT = 10;

const app = express();

app.use(
  bodyParser.json({
    limit: '1MB',
  })
);
app.use(cookieParser());

app.use(cors());

app.use(auth.load_express_session());

// DOCS: The user must provide the custom function to login (access database and etc.)
auth.initialize_local_passport(
  async (username, password, done) => {
    try {
      console.debug('Username', username, 'Password', password);
      const user = await conn('accounts').where({ username: username }).select('id', 'password');
      console.debug('user', user);
      if (!user || user.length > 1 || user.length == 0) throw new Error('Unable to login.');
      if (!user[0].id) throw new Error('Unable to login.');
      const match = await bcrypt.compare(password, user[0].password);
      if (!match) throw new Error('Unable to login.');
      return done(null, { id: user[0].id });
    } catch (e) {
      console.error(e.message);
      return done(e);
    }
  }, // login_function
  async (user_id) => await conn('accounts').where('id', user_id).select('username', 'id') // deserialize_function
);
app.use(auth.initialize_passport());
app.use(auth.passport_session());

// curl -XPOST http://localhost:4444/register -H "Content-Type: application/json" -d '{"username":"tommy","password":"12345"}'
app.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  const hashed_password = await bcrypt.hash(password, SALT);
  try {
    const user = await conn('accounts').insert({ username: username, password: hashed_password }).returning('id');
    console.debug('New user', user);
    return res.json({ message: 'Ok !', id: user[0].id });
  } catch (e) {
    console.error(e.message);
    return next(e);
  }
});

// curl -v -XPOST http://localhost:4444/login -H "Content-Type: application/json" -d '{"username":"tommy","password":"12345"}'
// Should print: Found. Redirecting to /account
// Grab the Set-Cookie value for next step.
app.post('/login', auth.local_login('/account', '/login'), (req, res, next) => {
  console.log('User', req.user, req.session, req.cookies);
  return res.json({ message: 'Ok !' });
});

// curl http://127.0.0.1:4444/c -H "cookie: connect.sid=s%3A2CZc2ys5-z7KVQ8j6_fepc96LA4T2Er0.hFoUKnz%2Fs%2B12lMb2xG2S%2FcgGSgMRjvFx3s5Y%2FTXLYR4; Path=/; HttpOnly"
// Should print: {"message":"Yes","user":[{"username":"tommy","id":1}]}
app.get('/c', auth.is_local_authenticated(), (req, res, next) => {
  console.log('User', req.user, req.session, req.isAuthenticated());
  return res.json({ message: 'Yes', user: req.user });
});

// Global Error Handling
app.use((error, req, res, next) => {
  console.error(error.message);
  console.error(error.stack);
  res.status(500).send(error.message || "I don't know .. sorry");
});

app.listen(4444, '0.0.0.0', () => {
  console.log(`Backend started at 0.0.0.0:4444`);
});

// Tests
// WORKS   curl -XPOST http://localhost:4444/login -H "Content-Type: application/json" -d '{"username":"tommy","password":"12345"}' #-> should /home
// INVALID curl -XPOST http://localhost:4444/login #-> should /login and prints Missing credentials
// INVALID curl -XPOST http://localhost:4444/login -d '{"email":"tommy","password":"12345"}' #-> should /login and prints Missing credentials
// INVALID curl -XPOST http://localhost:4444/login -H "Content-Type: application/json" -d '{"email":"tommy","password":"12345"}' #-> should /login and prints Missing credentials
// INVALID curl -XGET http://localhost:4444/connected #-> should /login and prints Missing credentials
