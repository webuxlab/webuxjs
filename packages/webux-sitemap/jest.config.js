// jest.config.js

export default {
  transform: {},
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        outputName: 'report.xml',
      },
    ],
  ],
};
