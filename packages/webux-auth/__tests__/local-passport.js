const WebuxAuth = require('../src/index.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const auth = new WebuxAuth({
  session: { express_session_secret: 'shhh', resave: false, save_uninitialized: true, cookie: { secure: false } },
  local: { redirect_url: '/login', redirect_home: '/home' },
});

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
auth.initialize_local_passport(function (username, password, done) {
  return done(null, { username: 'tommy', email: 'tommy@studiowebux.com', id: '123' });
  // TODO: Not implemented.
  // fetch from the Database the user/pass and manage everything
});
app.use(auth.initialize_passport());
app.use(auth.passport_session());

app.post('/login', auth.local_login(), (req, res, next) => {
  console.log('User', req.user, req.session);
  return res.json({ message: 'Ok !' });
});

//

app.get('/c', auth.is_local_authenticated(), (req, res, next) => {
  console.log('User', req.user, req.session, req.isAuthenticated());
  return res.json({ message: 'Yes' });
});

// Global Error Handling
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send(error.message || "I don't know .. sorry");
});

app.listen(3000, '127.0.0.1', () => {
  console.log(`Backend started at 127.0.0.1:3000`);
});

// Tests
// WORKS   curl -XPOST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"tommy","password":"12345"}' #-> should /home
// INVALID curl -XPOST http://localhost:3000/login #-> should /login and prints Missing credentials
// INVALID curl -XPOST http://localhost:3000/login -d '{"email":"tommy","password":"12345"}' #-> should /login and prints Missing credentials
// INVALID curl -XPOST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email":"tommy","password":"12345"}' #-> should /login and prints Missing credentials
// INVALID curl -XGET http://localhost:3000/connected #-> should /login and prints Missing credentials
