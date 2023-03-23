/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, json, colorize } = format;
const WinstonLogStash = require('winston3-logstash-transport');
const { filterSecret } = require('./filter');

/**
 * Creates a custom logger with or without options.
 * @param {Object} options The configuration of the module, Optional
 * @returns {Object} Returns the logger.
 */
module.exports = (options = {}) => {
  // Creates the logger
  const logger = createLogger({
    defaultMeta: options.meta,
    format: combine(
      label({
        label: process.env.LOGGER_APPLICATION_ID || options.application_id || 'No label defined.',
      }),
      filterSecret(options.deniedKeys)(),
      timestamp(),
      json(),
      colorize(),
    ),
  });

  // For each files defined in the options
  // link the filename and the error level.
  // It stores the logs in a file
  if (options.filenames) {
    Object.keys(options.filenames).forEach((level) => {
      if (!options.filenames[level]) {
        throw new Error('Invalid file provided');
      }
      logger.info(`Adding Local File '${level}' to transport`);
      logger.add(
        new transports.File({
          level,
          filename: options.filenames[level],
        }),
      );
    });
  }

  // If Logstash configuration is defined
  if (options.logstash && options.logstash.host && options.logstash.port) {
    logger.info('Adding Logstash to transport');
    const winstonLogstash = new WinstonLogStash({
      mode: options.logstash.mode || 'tcp',
      host: options.logstash.host,
      port: options.logstash.port,
      applicationName: process.env.LOGGER_APPLICATION_ID || options.application_id,
      trailingLineFeed: true,
      formatted: false,
    });
    logger.add(winstonLogstash);

    winstonLogstash.on('error', (err) => logger.error(err.message));
    winstonLogstash.on('close', () => logger.error('Logstash transport closed'));
  }

  // Adds console redirection,
  // If not in 'production' or 'forced' to print.
  // eslint-disable-next-line eqeqeq
  if (process.env.LOGGER_FORCE_CONSOLE == true || options.forceConsole === true || process.env.NODE_ENV !== 'production') {
    logger.info('Adding Console to transport');
    logger.add(
      new transports.Console({
        level: process.env.LOGGER_CONSOLE_LEVEL || options.consoleLevel || 'silly',
        format: format.simple(),
      }),
    );
  }

  // Defines the stream object for morgan
  logger.stream = {
    write: (message) => {
      // This message is required to work with logstash
      // Otherwise the entry is ignored.
      const object = {
        message: 'Logging using stream function',
      };

      try {
        const cleaned = JSON.parse(message);
        cleaned.body = JSON.parse(message).body ? JSON.parse(JSON.parse(message).body) : {};
        cleaned.params = JSON.parse(message).params ? JSON.parse(JSON.parse(message).params) : {};
        cleaned.headers = JSON.parse(message).headers ? JSON.parse(JSON.parse(message).headers) : {};
        cleaned.query = JSON.parse(message).query ? JSON.parse(JSON.parse(message).query) : {};
        cleaned.url = JSON.parse(message).url ? JSON.parse(message).url : '';

        logger.info({ ...object, ...cleaned });
      } catch (e) {
        // It goes here when the JSON.parse fail
        // This is expected based on the type configured.
        logger.info({ message });
      }
    },
  };

  return logger;
};
