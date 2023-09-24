// jest.config.js

module.exports = {
  testTimeout: 30000,
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports",
        outputName: "report.xml",
      },
    ],
  ],
};
