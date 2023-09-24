const { ApiError } = require('../src/errorhandler');
const WebuxApp = require('../src');

test('API Error', () => {
  const handler = () => {
    throw new ApiError('My error Message', 'JEST_TEST', 400, { foo: 'bar' }, 'Occured while testing with jest');
  };

  expect(handler).toThrow(ApiError);
});

test('API Error and data collecting', async () => {
  const handler = () => {
    throw new ApiError('My error Message', 'JEST_TEST', 400, { foo: 'bar' }, 'Occured while testing with jest');
  };

  expect(handler).toThrow(ApiError);
  expect(handler).toThrow('My error Message');
  await expect(async () => handler()).rejects.toMatchObject({
    code: 400,
    cause: 'JEST_TEST',
    extra: { foo: 'bar' },
    devMessage: 'Occured while testing with jest',
  });
});

test('API Error using Webux App Class Wrapper', async () => {
  const handler = () => {
    throw WebuxApp.Error('My error Message', 'JEST_TEST', 400, { foo: 'bar' }, 'Occured while testing with jest');
  };

  expect(handler).toThrow(ApiError);
  expect(handler).toThrow('My error Message');
  await expect(async () => handler()).rejects.toMatchObject({
    code: 400,
    cause: 'JEST_TEST',
    extra: { foo: 'bar' },
    devMessage: 'Occured while testing with jest',
  });
});
