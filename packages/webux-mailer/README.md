## Introduction

This module is a wrapper to send emails, it uses nodemailer.

## Installation

```bash
npm install --save @studiowebux/mailer
```

[NPM](https://www.npmjs.com/package/@studiowebux/mailer)

## Usage

### Configuration

#### Transport configuration

Official documentation : https://nodemailer.com/smtp/

```javascript
const opts = {
  isEnabled: true,
  host: "127.0.0.1",
  port: 2525,
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
  pool: false,
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
};
```

> The `isEnabled` parameter allows to deactivate the mailer service, that way it doesn't send all emails while doing tests.

#### Email data object

Official documentation : https://nodemailer.com/message/

```javascript
// NOTE : bcc field is not detected by the mailparser and/or the smtp-server
const data = {
  from: "test@from.local",
  to: ["test1@to.local", "test2@to.local"],
  cc: ["test3@cc.local", "test5@cc.local", "test6@cc.local"],
  bcc: ["test4@bcc.local"],
  subject: "Testing the webux mailer",
  html: "<p>Hello World !</p>",
  text: "Hello World !",
};
```

### Functions

#### constructor(opts, log = console)

Initializes the transporter and the logger function

#### Verify(): Promise\<String\>

Verifies the transporter configuration and authentication

```javascript
webuxMailer
  .Verify()
  .then((info) => {
    console.log(info);
  })
  .catch((e) => {
    console.error(e);
  });
```

#### Sendmail(data): Promise\<Object\>

Sends an email if the mailer is enabled

```javascript
const data = {
  from: "test@from.local",
  to: ["test1@to.local", "test2@to.local"],
  subject: "Testing the webux mailer",
  html: "<p>Hello World !</p>",
  text: "Hello World !",
};

webuxMailer
  .Sendmail(data)
  .then((info) => {
    console.log(info);
  })
  .catch((e) => {
    console.error(e);
  });
```

### Quick start

> For testing only, Check the examples/ directory for complete code.

example.js

```javascript
const WebuxMailer = require("@studiowebux/mailer");

const opts = {
  isEnabled: true,
  host: process.env.HOST || "127.0.0.1",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.USER || "",
    pass: process.env.PASSWORD || "",
  },
};

const webuxMailer = new WebuxMailer(opts, console);

const data = {
  from: "test@from.local",
  to: ["test1@to.local", "test2@to.local"],
  subject: "Testing the webux mailer",
  html: "<p>Hello World !</p>",
  text: "Hello World !",
};

webuxMailer.Sendmail(data).then((info) => {
  console.log(info);
});
```

## Videos and other resources

- [Live Demo](https://mailer.webuxlab.com)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
