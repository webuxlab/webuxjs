/* eslint-disable no-async-promise-executor */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-04-03
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const nodemailer = require('nodemailer');

/**
 * @class Mailer Class
 */
class Mailer {
  /**
   *
   * @param {object} opts Options to enable the mailer and configure the transport
   * @param {object} log Custom logger function (Default: console)
   * @constructor
   */
  constructor(opts, log = console) {
    this.config = opts || {};
    this.isEnabled = this.config.isEnabled ? this.config.isEnabled : false;
    this.log = log;

    this.log.debug('webux-mailer - Logger function configured');

    if (this.isEnabled) {
      this.log.debug('webux-mailer - Configuring the transporter');
      this.transporter = nodemailer.createTransport(this.config);

      this.log.debug('webux-mailer - Transporter configured');
    }
  }

  /**
   * Verify the transporter configuration and authentication
   * @return {Promise<string>} Returns a message
   */
  Verify() {
    return new Promise(async (resolve, reject) => {
      this.log.debug(
        'webux-mailer - Verifying the transporter connection and authentication information',
      );
      const verified = await this.transporter.verify().catch((e) => reject(new Error(`webux-mailer - ${e.message}`)));

      if (!verified) {
        return reject(new Error(
          'webux-mailer - Please verify your connection or authentication information',
        ));
      }

      this.log.debug(
        'webux-mailer - Transporter connection and authentication verified',
      );

      return resolve(
        'webux-mailer - Transporter connection and authentication verified',
      );
    });
  }

  /**
   * To send an email if the mailer is enabled
   * @param {object} data The data to define the email
   * @return {Promise<object>}  the message object
   */
  Sendmail(data) {
    return new Promise(async (resolve, reject) => {
      if (!this.isEnabled) {
        return reject(new Error('webux-mailer - Mail feature is disabled'));
      }
      if (!data) {
        return reject(new Error('webux-mailer - Unable to send the email, no data provided'));
      }

      this.log.debug('webux-mailer - Sending the email');
      const sent = await this.transporter.sendMail(data).catch((e) => reject(new Error(`webux-mailer - ${e.message}`)));

      if (!sent) {
        this.log.debug('webux-mailer - email not sent');
        return reject(new Error('webux-mailer - Message not Sent'));
      }
      this.log.debug(`webux-mailer - email sent (id: ${sent.messageId})`);
      return resolve(sent);
    });
  }
}

module.exports = Mailer;
