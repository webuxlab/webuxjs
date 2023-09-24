const { Telemetry } = require('../src');

function timer(duration = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

test('Create telemetry without option', () => {
  const telemetry = new Telemetry();

  expect(telemetry).toMatchObject({
    config: { telemetryEndpoint: 'http://127.0.0.1:3000/telemetry' },
    info: {
      osPlatform: null,
      loadAvg: null,
      osRelease: null,
      osType: null,
      totalMem: null,
      freeMem: null,
      cpus: null,
      osArch: null,
      softwareVersions: [],
    },
    actions: {
      commandUsed: [], // track command + duration
      errors: [],
      warnings: [],
      debugEnabled: false,
      verboseEnabled: false,
      exitCode: 0,
      exitReason: '',
    },
    startTime: null,
    stopTime: null,
  });
});

test('Create telemetry and test debug and verbose mode', () => {
  const telemetry = new Telemetry();

  expect(telemetry.actions.verboseEnabled).toBeFalsy();
  expect(telemetry.actions.debugEnabled).toBeFalsy();
  telemetry.SetVerboseMode(true);

  expect(telemetry.actions.verboseEnabled).toBeTruthy();

  telemetry.SetDebugMode(true);

  expect(telemetry.actions.debugEnabled).toBeTruthy();
});

test('Create telemetry and get System information', () => {
  const telemetry = new Telemetry();

  telemetry.RetrieveSystemInformation();

  expect(telemetry.info.cpus).toBeDefined();
  expect(telemetry.info.freeMem).toBeDefined();
  expect(telemetry.info.osPlatform).toBeDefined();
  expect(telemetry.info.loadAvg).toBeDefined();
  expect(telemetry.info.osRelease).toBeDefined();
  expect(telemetry.info.osType).toBeDefined();
  expect(telemetry.info.totalMem).toBeDefined();
  expect(telemetry.info.osArch).toBeDefined();
  // telemetry.printSystemInformation();
});

test('Create telemetry and start/stop timer', async () => {
  const telemetry = new Telemetry();

  telemetry.StartTimer();

  await timer(1000);

  telemetry.StopTimer();

  expect(telemetry.startTime).toBeDefined();
  expect(telemetry.stopTime).toBeDefined();

  expect(Math.round(telemetry.GetDuration() / 1000)).toBe(1);
});

test('Create telemetry and log Action', async () => {
  const telemetry = new Telemetry();

  telemetry.LogAction('publish', true);
  await timer(3000);
  telemetry.LogAction('publish');

  expect(telemetry.actions.commandUsed.length).toBe(2);
});

test('Create telemetry and log Error', async () => {
  const telemetry = new Telemetry();

  telemetry.LogError(new Error('This is an error'));
  expect(telemetry.actions.errors.length).toBe(1);
});

test('Create telemetry and log Warning', async () => {
  const telemetry = new Telemetry();

  telemetry.LogWarning('This is a warning');
  expect(telemetry.actions.warnings.length).toBe(1);
});

test('Create telemetry and set exit code and reason', async () => {
  const telemetry = new Telemetry();

  telemetry.SetExitCodeAndReason(0, 'Success');
  expect(telemetry.actions.exitCode).toBe(0);
  expect(telemetry.actions.exitReason).toBe('Success');
});

test('Create telemetry and add a software version', async () => {
  const telemetry = new Telemetry();

  telemetry.SetSoftwareVersion('git', 'git version 2.17.1');
  expect(telemetry.info.softwareVersions.length).toBe(1);
});

test.skip('Create telemetry and Send data', async () => {
  const telemetry = new Telemetry();

  telemetry.SetDebugMode(true);
  telemetry.RetrieveSystemInformation();
  telemetry.StartTimer();
  telemetry.LogAction('publish', true);
  telemetry.LogError(new Error('This is an error'));
  await timer(3000);
  telemetry.LogAction('publish');
  telemetry.LogWarning('This is a warning');
  telemetry.SetExitCodeAndReason(0, 'Success');
  telemetry.SetSoftwareVersion('git', 'git version 2.17.1');
  telemetry.StopTimer();

  const fn = jest.fn(async () => telemetry.SendTelemetry());
  await fn();
  expect(fn).toHaveReturned();
});
