import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

/**
 * Documentation: https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
 *
 */
export function tracing_v2(
  config = {
    trace: { url: 'http://localhost:4318/v1/traces', headers: {} },
    metric: { url: 'http://localhost:4318/v1/metrics', headers: {} },
  },
) {
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

  // For local development to stop the tracing using Control+c
  process.on('SIGINT', async () => {
    try {
      await sdk.shutdown();
      console.log('Tracing finished.');
    } catch (error) {
      console.error(error);
    } finally {
      process.exit(0);
    }
  });
}
