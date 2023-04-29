## Introduction

This module wraps Rabbit MQ commands

## Installation

```bash
npm install --save @studiowebux/queue
```

[NPM](https://www.npmjs.com/package/@studiowebux/queue)

## Usage

### Configuration

> **TL;DR;** Same as `amqplib`

```js
const config = {
  connection: {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'user',
    password: 'password',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: 'my_vhost',
  },
  queue: {
    expiration: (60 * 1000 * 60).toString(),
    persistent: true,
  },
};
```

## Functions

TBD

```bash
npm run doc
```

## Quick start

> The `/examples` directory has one example, use the `start.sh` script

## Videos and other resources

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
