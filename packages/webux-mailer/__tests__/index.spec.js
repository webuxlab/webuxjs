import WebuxMailer from '../src/index.js';

test('Create Mail Instance without options', () => {
  const mail = new WebuxMailer();

  expect(mail).toMatchObject({
    config: {},
    isEnabled: false,
    log: console,
  });
});

test('Create Mail Instance with options', () => {
  const opts = {
    isEnabled: true,
    host: process.env.HOST || '127.0.0.1',
    port: 2525,
    secure: false,
    auth: {
      user: process.env.USER || '',
      pass: process.env.PASSWORD || '',
    },
  };

  const mail = new WebuxMailer(opts);

  expect(mail).toMatchObject({
    config: opts,
    isEnabled: true,
    log: console,
  });
});

// Need to read about async/await and jest
// test('Verify configuration', () => {
//   const opts = {
//     isEnabled: true,
//     host: process.env.HOST || '127.0.0.1',
//     port: 2525,
//     secure: false,
//     auth: {
//       user: process.env.USER || '',
//       pass: process.env.PASSWORD || '',
//     },
//   };

//   const mail = new WebuxMailer(opts);

//   const check = jest.fn(async () => {
//     await mail.Verify()
//       .catch(() => false);
//     return true;
//   });

//   check();

//   expect(check).toHaveReturned(false);
// });
