/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2023-04-26
 * License: All rights reserved Studio Webux 2015-Present
 */

import { Kafka, CompressionTypes } from 'kafkajs';
export { logLevel } from 'kafkajs';

/**
 * @class PubSub Class
 */
export class PubSub {
  /**
   *
   * @param {object} opts Options
   * @param {object} log Custom logger function (Default: console)
   * @constructor
   */
  constructor(opts, log = console) {
    this.config = opts || {
      client: {},
      producer: { connection: {} },
      consumer: { connection: {}, subscribe: { fromBeginning: true } },
    };
    this.log = log;

    // Kafka Variables
    this.connection = null;
    this.producer = null;
    this.consumer = null;

    this.log.debug('webux-pubsub - Logger function configured');
  }

  /**
   * Connect kafka client
   */
  connect() {
    this.connection = new Kafka(this.config.client);
  }

  /**
   *
   * @param {strign} topicName
   * @param {Array} messages Array of messages to send to the topic
   */
  async sendMessages(topicName, messages) {
    try {
      await this.producer.send({
        topic: topicName,
        messages,
        compression: CompressionTypes.GZIP,
      });
    } catch (e) {
      await this.producer.disconnect();
      this.log.error(e.message);
      throw e;
    }
  }

  /**
   *
   * @param {Array} messages Array of messages to send to the topic (Including topic name)
   */
  async sendBatchMessages(messages) {
    try {
      await this.producer.sendBatch({ topicMessages: messages, compression: CompressionTypes.GZIP });
    } catch (e) {
      await this.producer.disconnect();
      this.log.error(e.message);
      throw e;
    }
  }

  /**
   *
   * @param {String[]} topics list of topic name to consume from
   * @param {function} handler function to execute when receiving a message
   */
  async consumeMessage(
    topics,
    handler = ({ topic, partition, message }) => {
      setTimeout(() => {
        this.log.debug({
          value: message.value.toString(),
          topic,
          partition,
        });
      }, Math.random() * 1000);
    },
  ) {
    try {
      await this.consumer.subscribe({ topics, ...this.config.consumer.subscribe });
      await this.consumer.run({
        autoCommit: true,
        autoCommitInterval: 5000,
        autoCommitThreshold: 100,
        eachMessage: handler,
      });
    } catch (e) {
      await this.consumer.disconnect();
      this.log.error(e.message);
      throw e;
    }
  }

  /**
   * Connect producer and error handling
   */
  async connectProducer() {
    await this.errorHandling(this.producer);
    this.producer = this.connection.producer(this.config.producer.connect);
    await this.producer.connect();
  }

  /**
   * Connect consumer and error handling
   */
  async connectConsumer(groupId) {
    await this.errorHandling(this.consumer);
    this.consumer = this.connection.consumer({ groupId });
    await this.consumer.connect(this.config.consumer.connect);
  }

  async disconnectProducer() {
    await this.producer.disconnect();
  }

  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async errorHandling(client) {
    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    errorTypes.forEach((type) => {
      process.on(type, async (e) => {
        try {
          this.log.log(`process.on ${type}`);
          this.log.error(e);
          await client.disconnect();
          process.exit(0);
        } catch {
          process.exit(1);
        }
      });
    });

    signalTraps.forEach((type) => {
      process.once(type, async () => {
        try {
          await client.disconnect();
        } finally {
          process.kill(process.pid, type);
        }
      });
    });
  }
}
