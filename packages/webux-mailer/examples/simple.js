const WebuxMailer = require('../src/index');

const opts = {
  isEnabled: true,
  host: process.env.HOST || '127.0.0.1',
  port: 2525,
  secure: false,
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
  .Verify()
  .then((info) => {
    console.log(info);
    webuxMailer
      .Sendmail(data)
      .then((mailInfo) => {
        console.log(mailInfo);
      })
      .catch((e) => {
        console.error(e);
        process.exit(2);
      });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
