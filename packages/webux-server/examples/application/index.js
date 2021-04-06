/* eslint-disable global-require */
const instance = require('./instance');

async function loadApp() {
  // Request interceptor
  instance.app.use('*', (req, res, next) => {
    console.log(`New request on worker #${instance.server.cluster.worker.id}`);
    console.log(`Request resource : ${req.baseUrl}`);
    console.log('---');
    next();
  });

  instance.app.use('/hello', (req, res) => {
    res.status(200).send(instance.myFn());
  });

  instance.app.use('/', (req, res) => {
    res.status(200).json(instance.config);
  });

  await instance.server.StartCluster();

  console.log(
    'Load something else too, like a socket.io server or MQTT and others',
  );

  instance.myFn = require('./myFn');
}

try {
  loadApp();
} catch (e) {
  console.error(e);
  process.exit(1);
}
