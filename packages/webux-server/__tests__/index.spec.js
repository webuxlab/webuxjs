import express from 'express';
import packageJson from '../package.json' assert { type: 'json' };
import WebuxServer from '../src/index.js';

test('Creates a server instance without options nor app', () => {
  function check() {
    const Server = new WebuxServer();
    return Server;
  }

  expect(check).toThrowError('The mandatory options are required');
});

test('Creates a server instance with options but no app', () => {
  const options = {
    ssl: {
      enabled: false,
      key: '',
      cert: '',
    },
    enterprise: 'Studio Webux',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: packageJson.version,
    endpoint: '/api/v1',
    port: process.env.PORT || 1337,
  };

  const Server = new WebuxServer(options);

  expect(Server).toMatchObject({
    config: options,
    app: undefined,
    log: console,
    port: options.port,
    ssl: null,
    server: null,
  });
});

test('Creates a server instance with options and an app', () => {
  const options = {
    ssl: {
      enabled: false,
      key: '',
      cert: '',
    },
    enterprise: 'Studio Webux',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: packageJson.version,
    endpoint: '/api/v1',
    port: process.env.PORT || 1337,
  };
  const app = express();

  const Server = new WebuxServer(options, app);

  expect(Server).toMatchObject({
    config: options,
    app: expect.any(Function),
    log: console,
    port: parseInt(options.port, 10),
    ssl: null,
    server: null,
  });
});

test('Using a random port', () => {
  const options = {
    enterprise: 'Studio Webux',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: packageJson.version,
    endpoint: '/api/v1',
  };

  const Server = new WebuxServer(options);

  expect(Server).toMatchObject({
    config: options,
    app: undefined,
    log: console,
    port: 0,
    ssl: null,
    server: null,
  });
});

test('Using a custom handler', () => {
  const handler = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Hello World From the server');
    res.end();
  };
  const options = {
    enterprise: 'Studio Webux',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: packageJson.version,
    endpoint: '/api/v1',
    port: process.env.PORT || 1337,
  };

  const webuxServer = new WebuxServer(options, handler, console);

  expect(webuxServer).toMatchObject({
    config: options,
    app: handler,
    log: console,
    port: parseInt(options.port, 10),
    ssl: null,
    server: null,
  });
});

test('Using SSL', () => {
  const KEY =
    'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2d0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktrd2dnU2xBZ0VBQW9JQkFRQzVORW1WMEhnWW9NZVUKRGhGaFcwS1FOdkt1c3JjYkdQMHllZGtjYzdiRjdSKzlndWt2YzZQcUFIalVweFNOMGJkcGZLSWI3MmVoNDR4NgpqNU9XN2x2RUlYanNuNzlNSmxaRGpDQnRvRGI3QUxxTmlDSy94RTdVZ09pREk0enBSY0FmV0ZZdk5BUUVlL0VvCjQ5V0pOWEpST09FTEdEaDVKQ3lZVVNUWjQrRnArNEtGZEJMK2oyNEVlVG9lQU8yTEhTRkgvTDRMQjgzVkNZdGUKWnl2VjFWV0lBaVNqQkhWd241Y0FHOUdrL3pyYmFVdGVPSGNaVzlBM00ydXdNL1lQM1FZcXZPY3M1WHlYaTNMSwo1WE9IbmVKNnhqSmQ3OHl3WmJ4aGUzeEdSWkhRdjB1aGh1WFdLMGVQN0pHVVZXSlQ2NEw2UFJWVHV2WS9tSWxHCjJsNnRJRVFWQWdNQkFBRUNnZ0VCQUkzZnZDOER6N3d1RGpVZ3diZXV6VUxrbE91M0JBWENFdFJEKzBtTWF3c2MKSnlCcDFIQUJTaVBMME1RMmFjeHFSdktNQXpNYkptd2hnRSt6QlFDdC82WXpiZ3IySlBrVXRTaHhnN1gyOGFjKwpXNnBvQ3hhVUx6OGlzUHNrbEtGdVNVcTV4T3ZNRVBmT2FtTkVoU1BpeVh2bThwNHBJN25KT0ZCR2VOQmhmU0JOCnQxUWhqaWliN0VpeGw1RGtETzlwWHBUaTVMaVBsMVJQbGFKL0tqRUMvNmh1cjJlYXpmK0QyTW1wZGVNZlJyWWgKQysyUVhiTmN6QTlxWkQyaUZBWEZZV0JqL1JrR09FSGY5cE1qRjRKaXJHc3BSSHJCK1JXVXI4UTVzeXl1MFVaOAo3Z0hZV08zblBPR0szQnFjaEtlY0gxMEZTYWtLQWpEczAwaExDV1lBSlZFQ2dZRUE5RHZ0SGVBUk03ZGxxdEQrCjVEczcxNkppTERUbGl6MkFaTGV3MnJweTUyMmdCcEpPcmJ1YWc1YUwxTHFBUWtmeWpwZjRVcElvbTFVUWsrT3kKdGIyQW9MYVQ3eXRFaWpuRVZFcU1KYUlBV2M1dG9NQzJ0aVJLZlYrbXc0NlF1T1VnNC91eWlQZVFsc1NjZGQyZQpaeGd3a3hzL1lRMEtMaHJGZjJQQVdiUk84c2NDZ1lFQXdpQmNxYzJiOWpGdDRCbW1tOU1wa0U5cmZGZE9GK2JuCnVJOG1XbE5PY0JXZWJucGxHa2duSGRQUmRzTnVJbUhjTGpVL2swaTJRa00yV0JMMnhPR1VlSzNMWEVCYUx3dlgKd3JodWRuQXVFbEpkL3dXNVBlcFVuWXFsSTVCdXRwWUFrbkpMbHBTNTdKMHRQZVFuMXl2UkY5ZkpvMUNHQTRFQQpuOWFyRFdQNWRrTUNnWUVBMVZVbStFcUpIQkJjK01qWGJFb2xLbVNIdGk5Nk5aYkIrTGZPL2krUVFJQXNJTEZaCmtqMWxhUDF1SktISGVKM1p6QjRJWlMrUDBxYUo5WFFWM05PcmNEWXFuK1crVjdLL3dCVGh0OWw2enZjV0lTMVUKSzJNbHdiOTBMaXJ3Vk9DblN4ekd4UWJod0IvNnZxV1hRRndMeWVNcUNEN1lubzc1NWgwZW5meDJYVzhDZ1lBUApHRVVjVHdpWmxDNWZCcCtWN2syRkV5ZmdlMGx2UWwweVZLOCt4c3VLbTZPK0kzWkpIT010eHBLN0VXYzI5VFVSCndzSTJ5YWlpYm1lRFliWWVpUXZxZGxraHl6ODMrVXZGc0dHbWhBS1JHaWFFOWdUNWM0Y3cyTjhPYk9TdS9lcjkKZURXNGQ4Z2RSZnVHbkg4Y2xDT21IdmxtNFpRS0liWFN0L2FGREFrUjBRS0JnUURvSDVFMEd3Z0N2Z29tQVNHUQpSQy8rWDBPQjNTRXN4blRkRUsvVzIxU21iaXI2TjZQVGdNcE9acWhTQksvaWxBZE5ueVhtYXhoNUt6SmxuM2F1CmxtYWlWRmp3M0tWOGVTRGZhNExDYUdFeTUrdTlQNEh5Mk94TmE2dDJham8xMTM1OVBtdFIzU1MrSU9KOFVxZEIKYWRWOGlEYWdjNklyRGVodFcvTjBpbVpHbVE9PQotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg==';
  const CERT =
    'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURRakNDQWlvQ0NRRDhqR3M2dzRKa1lEQU5CZ2txaGtpRzl3MEJBUXNGQURCak1Rc3dDUVlEVlFRR0V3SkQKUVRFUE1BMEdBMVVFQ0F3R1VYVmxZbVZqTVJjd0ZRWURWUVFIREE1VFlXbHVkR1V0ZEdobGNtVnpaVEVkTUJzRwpBMVVFQ2d3VVUzUjFaR2x2SUZkbFluVjRJRk11UlM1T0xrTXhDekFKQmdOVkJBc01Ba2xVTUI0WERUSXdNRFV3Ck1UQXdOVGN6T0ZvWERUSXdNRFV6TVRBd05UY3pPRm93WXpFTE1Ba0dBMVVFQmhNQ1EwRXhEekFOQmdOVkJBZ00KQmxGMVpXSmxZekVYTUJVR0ExVUVCd3dPVTJGcGJuUmxMWFJvWlhKbGMyVXhIVEFiQmdOVkJBb01GRk4wZFdScApieUJYWldKMWVDQlRMa1V1VGk1RE1Rc3dDUVlEVlFRTERBSkpWRENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFECmdnRVBBRENDQVFvQ2dnRUJBTGswU1pYUWVCaWd4NVFPRVdGYlFwQTI4cTZ5dHhzWS9USjUyUnh6dHNYdEg3MkMKNlM5em8rb0FlTlNuRkkzUnQybDhvaHZ2WjZIampIcVBrNWJ1VzhRaGVPeWZ2MHdtVmtPTUlHMmdOdnNBdW8ySQpJci9FVHRTQTZJTWpqT2xGd0I5WVZpODBCQVI3OFNqajFZazFjbEU0NFFzWU9Ia2tMSmhSSk5uajRXbjdnb1YwCkV2NlBiZ1I1T2g0QTdZc2RJVWY4dmdzSHpkVUppMTVuSzlYVlZZZ0NKS01FZFhDZmx3QWIwYVQvT3R0cFMxNDQKZHhsYjBEY3phN0F6OWcvZEJpcTg1eXpsZkplTGNzcmxjNGVkNG5yR01sM3Z6TEJsdkdGN2ZFWkZrZEMvUzZHRwo1ZFlyUjQvc2taUlZZbFByZ3ZvOUZWTzY5aitZaVViYVhxMGdSQlVDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUXNGCkFBT0NBUUVBTENrS3dpSUZsNFF5Q2ppaUUvcEt3Vm1SVEZnTDhpNERvcjROMUlrTzBOWlczOVU1NU1BSzJTYW4KN3ZQZ3F1YzhsNmQyWGQzUTI1b3RJZExEbUpib250YXJINkMvYUs1N0NRV2ZzT3VnVWZMR1V6enVwNzE3N25zZgphQ0p1UUNtSStObFl3cE1qR1FiYjJzUTBHUWZuZmYya2JSemRDZEVFY1ptWHlsTm5vMFVDQWd3bHNsbDZWQUpxCmJCaXRra0k1S1NqUnNLNG1ZQ1V4am95ZkREekZUaGsrSUlFWlRLUHhaS1IxT3dFR1pZSDN4UHB6eXJnUzQ1cDYKWExnRzhERWNDSmd2QUhUWDFDNFc1RGNxVlVoVlYydDRmMThNQWdRc3NuMzZJamt5Vm5vQVNNOFR5NWQ5a0xoZQpKd0pPL1ZLajdBQWpIREwyRzZ4Qi9ib3NDLzVCZ2c9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==';

  const options = {
    ssl: {
      enabled: true,
      cert: CERT,
      key: KEY,
    },
    enterprise: 'Studio Webux',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: packageJson.version,
    endpoint: '/api/v1',
    port: process.env.PORT || 1337,
  };

  const webuxServer = new WebuxServer(options);

  expect(webuxServer).toMatchObject({
    config: options,
    app: undefined,
    log: console,
    port: parseInt(options.port, 10),
    ssl: {
      key: Buffer.from(KEY, 'base64').toString('ascii'),
      cert: Buffer.from(CERT, 'base64').toString('ascii'),
    },
    server: null,
  });
});

test.skip('Start the server', async () => {
  const options = {
    ssl: {
      enabled: false,
      key: '',
      cert: '',
    },
    enterprise: 'Studio Webux',
    author: 'Tommy Gingras',
    project: '@studiowebux/bin',
    version: packageJson.version,
    endpoint: '/api/v1',
    port: process.env.PORT || 1337,
  };
  const app = express();

  const Server = new WebuxServer(options, app);
  const result = await Server.StartServer();

  result.close((err) => {
    if (err) {
      throw err;
    }
  });

  expect(result).toMatchObject(expect.any(Object));
  expect(Server).toMatchObject({ server: expect.any(Object) });
});
