/* eslint-disable global-require */
/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2021-07-01
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */
const os = require('os');
const axios = require('axios').default;

/**
 * @class Telemetry
 */
class Telemetry {
  /**
   *
   * @param {Object} opts The options to configure the telemetry (Default: {})
   * @constructor
   */
  constructor(opts = { telemetryEndpoint: 'http://127.0.0.1:3000/telemetry' }) {
    this.config = opts;

    this.info = {
      osPlatform: null,
      loadAvg: null,
      osRelease: null,
      osType: null,
      totalMem: null,
      freeMem: null,
      cpus: null,
      osArch: null,
      softwareVersions: [],
    };

    this.actions = {
      commandUsed: [], // track command + duration
      errors: [],
      warnings: [],
      debugEnabled: false,
      verboseEnabled: false,
      exitCode: 0,
      exitReason: '',
    };

    this.startTime = null;
    this.stopTime = null;
  }

  StartTimer() {
    this.startTime = new Date().getTime();
  }

  StopTimer() {
    this.stopTime = new Date().getTime();
  }

  GetDuration() {
    return this.stopTime - this.startTime;
  }

  RetrieveSystemInformation() {
    this.info = {
      ...this.info,
      osPlatform: os.platform(),
      loadAvg: os.loadavg(),
      osRelease: os.release(),
      osType: os.type(),
      totalMem: os.totalmem(),
      freeMem: os.freemem(),
      cpus: os.cpus(),
      osArch: os.arch(),
    };
  }

  PrintSystemInformation() {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(this.info));
  }

  LogAction(cmd, start = false) {
    const cmdUsed = {
      cmd,
      start: null,
      stop: null,
      stats: { freemem: os.freemem(), loadAvg: os.loadavg() },
    };

    if (start) {
      cmdUsed.start = new Date().getTime();
    } else {
      cmdUsed.stop = new Date().getTime();
    }

    this.actions.commandUsed.push(cmdUsed);
  }

  LogError(error) {
    this.actions.errors.push({ error, timestamp: new Date().getTime(), stats: { freemem: os.freemem(), loadAvg: os.loadavg() } });
  }

  LogWarning(warning) {
    this.actions.warnings.push({ warning, timestamp: new Date().getTime(), stats: { freemem: os.freemem(), loadAvg: os.loadavg() } });
  }

  SetDebugMode(enabled = false) {
    this.actions.debugEnabled = enabled;
  }

  SetVerboseMode(enabled = false) {
    this.actions.verboseEnabled = enabled;
  }

  SetExitCodeAndReason(exitCode, reason) {
    this.actions.exitCode = exitCode;
    this.actions.exitReason = reason;
  }

  SetSoftwareVersion(software, version) {
    this.info.softwareVersions.push({ software, version });
  }

  SendTelemetry() {
    try {
      return axios.post(`${this.config.telemetryEndpoint}`, {
        info: this.info,
        actions: this.actions,
        startTime: this.startTime,
        stopTime: this.stopTime,
        duration: this.GetDuration(),
      });

      // eslint-disable-next-line no-console
      // console.debug(response);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
      // do not fail
      return false;
    }
  }
}

module.exports = Telemetry;
