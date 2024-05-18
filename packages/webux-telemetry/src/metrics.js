const promClient = require('prom-client');
const promBundle = require('express-prom-bundle');

module.exports = {
  /**
   * Collect and offers prometheus metric for the service
   * TODO: Implement security
   * @param {*} projectName
   * @param {*} serviceName
   * @param {*} version
   * @returns
   */
  metricsMiddleware(projectName, serviceName, version = '0') {
    return promBundle({
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
      includeMethod: true,
      includePath: true,
      includeStatusCode: true,
      includeUp: true,
      customLabels: { project_name: projectName, service_name: serviceName, version },
      metricsPath: '/metrics',
      promClient: {
        collectDefaultMetrics: {},
      },
    });
  },

  /**
   * Increase a counter based on the request
   * @param {*} projectName
   * @param {*} serviceName
   * @param {*} version
   * @returns
   */
  requestCounterMiddleware(projectName, serviceName, version = '0') {
    const httpRequestsTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'HTTP Requests Total',
      labelNames: ['method', 'route', 'project_name', 'service_name', 'version'],
    });

    return (req, res, next) => {
      httpRequestsTotal
        .labels({
          version,
          method: req.method,
          route: req.path,
          project_name: projectName,
          service_name: serviceName,
        })
        .inc(1);
      return next();
    };
  },
};
