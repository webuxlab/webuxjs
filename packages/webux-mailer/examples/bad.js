import WebuxMailer from '../src/index.js';

const opts = {
  isEnabled: true,
  host: process.env.HOST || '127.0.0.1',
  port: 1111, // This is incorrect
  secure: true, // This is not configured/enabled
  auth: {
    user: process.env.USER || '',
    pass: process.env.PASSWORD || '',
  },
};

const webuxMailer = new WebuxMailer(opts);

const data = {
  from: 'test@from.local',
  to: ['test1@to.local', 'test2@to.local'],
  subject: 'Testing the webux mailer',
  html: "<h1>Welcome !</h1><p>Hello World !</p><div class='footer'>Studio Webux</div>",
  text: 'Hello World !',
};

webuxMailer
  .Sendmail(data)
  .then((info) => {
    console.log(info);
  })
  .catch((e) => {
    console.error(e);
    process.exit(2);
  });
