/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2023-04-26
 * License: All rights reserved Studio Webux 2015-Present
 */

import amqp from 'amqplib';
import crypto from 'node:crypto';

/**
 * @class Queue Class
 */
export default class Queue {
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
      this.log.debug('webux-queue: Connect');
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
      this.log.debug('webux-queue: Disconnect');
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
    this.log.debug('webux-queue: Create Channel');
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
    this.log.debug('webux-queue: Disconnect Channel');
    if (!this.channel) throw new Error('Channel not linked');
    await this.channel.close();
    this.channel = null;
  }

  /**
   *
   * @param {Buffer} payload
   */
  async sendToQueue(payload) {
    this.log.debug('webux-queue: Send to Queue');
    if (!this.channel) throw new Error('Channel not linked');
    await this.channel.sendToQueue(this.queueName, payload, {
      ...this.config.queue,
      messageId: crypto.randomUUID(),
      timestamp: new Date().getTime(),
    });
    this.log.debug(`Sending message to ${this.queueName}`);
  }

  /**
   * take a callback function in parameter to handle the messages
   * @returns Promise
   */
  async consumeMessage(callback) {
    this.log.debug('webux-queue: Consume Message');
    return this.channel.consume(this.queueName, async (msg) => await callback(this.channel, msg));
  }

  /**
   *
   * @param {*} message
   * @returns void
   */
  ack(message) {
    this.log.debug('webux-queue: Acknowledge Message');
    return this.channel.ack(message, this.config.queue.allUpTo, this.config.queue.requeue);
  }

  /**
   *
   * @param {*} message
   * @returns void
   */
  async nack(message) {
    this.log.debug('webux-queue: Reject Message');
    this.channel.nack(message, this.config.queue.allUpTo, this.config.queue.requeue);
    if (this.config.queue.requeue) await this.channel.recover();
  }
}
