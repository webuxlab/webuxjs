const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');

module.exports = {
  /**
   * Documentation: https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
   *
   */
  tracing_v2: (
    config = {
      trace: { url: 'http://localhost:4318/v1/traces', headers: {} },
      metric: { url: 'http://localhost:4318/v1/metrics', headers: {} },
    },
  ) => {
    // For troubleshooting, set the log level to DiagLogLevel.DEBUG
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({
        url: config.trace.url,
        headers: config.trace.headers,
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: config.metric.url,
          headers: config.metric.headers,
          concurrencyLimit: 1,
        }),
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
  },
};
