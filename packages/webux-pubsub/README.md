## Introduction

This module wraps KafkaJS commands

## Installation

```bash
npm install --save @studiowebux/pubsub
```

[NPM](https://www.npmjs.com/package/@studiowebux/pubsub)

## Usage

### Configuration

> **TL;DR;** Same as kafkajs, they are split using a different approach but the rest is the same.

```js
const config = {
  // Documentation: https://kafka.js.org/docs/configuration
  client: {
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.DEBUG,
    logCreator,
  },
  // Documentation: https://kafka.js.org/docs/producing#options
  producer: { connect: {} },
  // Documentation: https://kafka.js.org/docs/consuming#options
  consumer: { connect: {}, subscribe: { fromBeginning: false } },
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
