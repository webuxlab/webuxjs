## Introduction

This module uses **morgan** & **winston**.  
These two features are implemented

- A custom logger function
- A request interceptor

Why using this module,

- It allows to redirect the logs in **files**, on the **console** and/or in **logstash**.
- It allows to collect the request content easily with filters.

For more details (EN/FR) : [Wiki](https://github.com/studiowebux/webux-logger/wiki)

## Installation

```bash
npm install --save @studiowebux/logger
```

[NPM](https://www.npmjs.com/package/@studiowebux/logger)

## Usage

### Configuration

#### Options

| Key            | Value                                                                                                                                                    | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| type           | (_Morgan_) - Possible choices : [**combined**, **tiny**, **dev**, **common**, **short**, **json**]                                                       | _The `format` options is only used when the type is set to `json`_                                 |
| tokens         | (_Morgan_) - A list of tokens to collect information from.                                                                                               | If set to `null`, the default tokens will be used, <br />See below for the default values.         |
| format         | (_Morgan_) - The keys to collect in the request.                                                                                                         | _only used when the type is set to `json`_                                                         |
| application_id | (_Winston_) - An ID to simplify tthe sorting of the information.                                                                                         |                                                                                                    |
| forceConsole   | (_Winston_) - A boolean to print the messages on the console even in production.                                                                         | By default, the console is deactivated in production mode.                                         |
| consoleLevel   | (_Winston_) - It sets the log level to print on the console, <br />Possible choices : [**error**, **warn**, **info**, **verbose**, **debug**, **silly**] | If `silly` is chosen, all levels will be printed, but choosing `error` will only print the errors. |
| logstash       | (_Winston_) - The logstash configuration.                                                                                                                | An ELK instance is required to use this option <br /> Only the UDP configuration is supported.     |
| filenames      | (_Winston_) - A list of log level to be redirected in file.                                                                                              |                                                                                                    |
| deniedKeys     | (_Winston_) - A list of values that will be replaced with '\*\*\*\*\*'                                                                                   | See the examples for more information                                                              |

Available options:

```javascript
const options = {
  type: 'json', // combined, tiny, dev, common, short, json
  tokens: null,
  format: {
    method: ':method',
    url: ':url',
    status: ':status',
    body: ':body',
    params: ':params',
    query: ':query',
    headers: ':headers',
    'http-version': ':http-version',
    'remote-ip': ':remote-addr',
    'remote-user': ':remote-user',
    length: ':res[content-length]',
    referrer: ':referrer',
    'user-agent': ':user-agent',
    'accept-language': ':language',
    'response-time': ':response-time ms',
  },
  application_id: 'Test01',
  forceConsole: false,
  consoleLevel: 'silly', // error, warn, info, verbose, debug, silly
  logstash: {
    host: '127.0.0.1',
    port: '5000', // udp only !
  },
  filenames: {
    error: 'log/error.log',
    warn: 'log/warn.log',
    info: 'log/info.log',
    verbose: 'log/verbose.log',
    debug: 'log/debug.log',
    silly: 'log/silly.log',
  },
  deniedKeys: ['password', 'authorization', 'accessToken', 'refreshToken'],
};
```

### Default tokens:

```javascript
module.exports = [
  {
    name: 'body',
    needStringify: true,
  },
  {
    name: 'params',
    needStringify: true,
  },
  {
    name: 'query',
    needStringify: true,
  },
  {
    name: 'headers',
    needStringify: true,
  },
  {
    name: 'type',
    needStringify: false,
    value: 'content-type',
    parent: 'headers',
  },
  {
    name: 'language',
    needStringify: false,
    value: 'accept-language',
    parent: 'headers',
  },
];
```

## Functions

### constructor(opts = {}, log = console)

Initializes the configuration and the default logger.

```javascript
const WebuxLogger = require('@studiowebux/logger');

const webuxLogger = new WebuxLogger(opts, console);
```

### CreateLogger(): Object

It attaches the custom logger to the `log` variable.  
It also returns the logger function.

```javascript
const log = webuxLogger.CreateLogger();
```

To use the custom logger function:

> Both methods are equivalent

```javascript
log.info('...');
log.error('...');
log.warn('...');
log.verbose('...');
log.debug('...');
log.silly('...');

webuxLogger.log.info('...');
webuxLogger.log.error('...');
webuxLogger.log.warn('...');
webuxLogger.log.verbose('...');
webuxLogger.log.debug('...');
webuxLogger.log.silly('...');
```

### OnRequest(): Function

It configures the request interceptor.

> this is required to have an Express instance to use the `app.use` function.

```javascript
const express = require('express');
const app = express();

const webuxLogger = new WebuxLogger(options, console);

app.use(webuxLogger.OnRequest());
```

## Quick start

> The `/examples` directory has multiple use cases.

### The request interceptor with Morgan

index.js

```javascript
const WebuxLogger = require('@studiowebux/logger');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const options = {
  type: 'json',
  format: {
    method: ':method',
    url: ':url',
    status: ':status',
    body: ':body',
    params: ':params',
    query: ':query',
    headers: ':headers',
    'http-version': ':http-version',
    'remote-ip': ':remote-addr',
    'remote-user': ':remote-user',
    length: ':res[content-length]',
    referrer: ':referrer',
    'user-agent': ':user-agent',
    'accept-language': ':language',
    'response-time': ':response-time ms',
  },
};

const webuxLogger = new WebuxLogger(options, console);

app.use(webuxLogger.OnRequest());

app.use(
  bodyParser.json({
    limit: '10MB',
  }),
);

app.get('/wait', (req, res) => {
  setTimeout(() => {
    res.status(200).json({ message: 'it took 1.5 seconds ...' });
  }, 1500);
});

app.use('*', (req, res) => {
  res.send('BONJOUR !');
});

app.listen(1337, () => {
  webuxLogger.log.info('Server is listening on port 1337');
});
```

- This configuration print the messages on the console without `winston`.
- The requests are logged in `JSON` format without filters, that means that everything is logged (**this is unsecure to do that**).

> (**Secure way**) Add filters provided by the custom logger (`CreateLogger()`).

> \*\* To log the body content, you have to use the `body-parser` package.

### ELK (Elastic, Logstash & Kibana)

The `examples` directory has a Docker to start an ELK instance to do some tests.

```bash
docker-compose up -d
```

## Videos and other resources

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
