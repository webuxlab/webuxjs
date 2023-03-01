const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { trace, context } = require('@opentelemetry/api');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ExpressInstrumentation } = require('opentelemetry-instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

module.exports = {
  middlewareTracing: (req, res, next) => {
    const currentSpan = trace.getSpan(context.active());
    const { traceId, spanId, traceFlags } = currentSpan.spanContext();
    res.set('traceId', traceId);
    res.set('spanId', spanId);
    res.set('trace_flags', traceFlags);
    return next();
  },

  tracing: (serviceName, version, endpoint = 'http://localhost:14268/api/traces') => {
    const exporter = new JaegerExporter({
      endpoint,
    });
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: version,
      }),
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register();
    registerInstrumentations({
      // TODO: Find a way to add more instrumentations the correct way.
      instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
      tracerProvider: provider,
    });

    return trace.getTracer(serviceName);
  },
};
