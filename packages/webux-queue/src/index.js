/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2023-04-26
 * License: All rights reserved Studio Webux 2015-Present
 */

const amqp = require('amqplib');
const crypto = require('crypto');

/**
 * @class Queue Class
 */
class Queue {
  /**
   *
   * @param {object} opts Options
   * @param {object} log Custom logger function (Default: console)
   * @constructor
   */
  constructor(opts, log = console) {
    this.config = opts || { connection: {}, queue: {} };
    this.log = log;

    // MQ Variables
    this.connection = null;
    this.channel = null;
    this.queueName = '';

    this.log.debug('webux-queue - Logger function configured');
  }

  /**
   * Initialize Connection
   * @returns void
   */
  async connect() {
    try {
      this.log.verbose('webux-queue: Connect');
      this.connection = await amqp.connect(this.config.connection);
    } catch (e) {
      this.log.error(e.message);
      throw e;
    }
  }

  /**
   * Disconnect the client
   * @returns void
   */
  async disconnect() {
    try {
      this.log.verbose('webux-queue: Disconnect');
      if (!this.connection) throw new Error(`Connection not initialized.`);
      await this.connection.close();
    } catch (e) {
      this.log.error(e.message);
      throw e;
    }
  }

  /**
   *
   * @param {string} queueName
   * @returns void
   */
  async createChannel(queueName) {
    this.log.verbose('webux-queue: Create Channel');
    if (this.channel) throw new Error('Channel already linked');
    this.channel = await this.connection.createChannel();
    this.queueName = queueName;
    await this.channel.assertQueue(queueName);
  }

  /**
   *
   * @returns void
   */
  async disconnectChannel() {
    this.log.verbose('webux-queue: Disconnect Channel');
    if (!this.channel) throw new Error('Channel not linked');
    await this.channel.close();
    this.channel = null;
  }

  /**
   *
   * @param {Buffer} payload
   */
  async sendToQueue(payload) {
    this.log.verbose('webux-queue: Send to Queue');
    if (!this.channel) throw new Error('Channel not linked');
    await this.channel.sendToQueue(this.queueName, payload, {
      ...this.config.queue,
      messageId: crypto.randomUUID(),
      timestamp: new Date().getTime(),
    });
    this.log.debug(`Sending message to ${this.queueName}`);
  }

  /**
   *
   * @returns message
   */
  async consumeMessage() {
    this.log.verbose('webux-queue: Consume Message');
    return new Promise((resolve) => this.channel.consume(this.queueName, (msg) => resolve(msg)));
  }

  /**
   *
   * @param {*} message
   * @returns void
   */
  ack(message) {
    this.log.verbose('webux-queue: Acknowledge Message');
    return this.channel.ack(message, this.config.queue.allUpTo, this.config.queue.requeue);
  }

  /**
   *
   * @param {*} message
   * @returns void
   */
  async nack(message) {
    this.log.verbose('webux-queue: Reject Message');
    this.channel.nack(message, this.config.queue.allUpTo, this.config.queue.requeue);
    if (this.config.queue.requeue) await this.channel.recover();
  }
}

module.exports = Queue;
