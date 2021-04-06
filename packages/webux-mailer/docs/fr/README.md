# Introduction

Ce module utilise `nodemailer` pour envoyer les courriels.

# Installation

```bash
npm install --save @studiowebux/mailer
```

[npm @studiowebux/mailer](https://www.npmjs.com/package/@studiowebux/mailer)

# Usage

## Configuration

### Configuration du Transport

Documentation officielle : https://nodemailer.com/smtp/

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

> Le paramètre `isEnabled` permet de tout simplement désactiver l'envoi des courriels, ceci peut être utile pour faire des tests, sans envoyer tous les courriels.

### L'objet pour créer un courriel

Documentation officielle : https://nodemailer.com/message/

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

## Fonctions

### constructor(opts, log = console)

Initialiser le transport avec un logger personnalisé.

### Verify(): Promise\<String\>

Vérifier la configuration et l'authentification du transport.

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

### Sendmail(data): Promise\<Object\>

Envoie un courriel seulement si le serveur est activé

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

## Démarrage rapide

> Tous les exemples sont disponibles : `/examples`

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

# Vidéos et autres ressources

- [Démo Live](https://mailer.webuxlab.com)
