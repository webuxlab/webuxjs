const WebuxMailer = require('../src/index');

const opts = {
  isEnabled: true,
  host: '',
  port: '',
  secure: '',
  auth: {
    user: '',
    pass: '',
  },
};

const webuxMailer = new WebuxMailer(opts);

const data = {
  from: 'test@from.local',
  to: ['test1@to.local', 'test2@to.local'],
  subject: 'Testing the webux mailer',
  html:
    "<h1>Welcome !</h1><p>Hello World !</p><div class='footer'>Studio Webux</div>",
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
