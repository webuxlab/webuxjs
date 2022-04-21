module.exports = {
  testTimeout: 30000,
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports",
        outputName: "test.xml",
      },
    ],
  ],
};
