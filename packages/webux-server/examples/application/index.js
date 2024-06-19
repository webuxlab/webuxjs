import instance from './instance.js';
import myFn from './myFn.js';

async function loadApp() {
  // Request interceptor
  instance.app.use('*', (req, res, next) => {
    console.log(`New request on worker #${instance.server.cluster.worker.id}`);
    console.log(`Request resource : ${req.baseUrl}`);
    console.log('---');
    next();
  });

  // curl localhost:1337/hello
  instance.app.use('/hello', (req, res) => {
    res.status(200).send(instance.myFn());
  });

  instance.app.use('/', (req, res) => {
    res.status(200).json(instance.config);
  });

  await instance.server.StartCluster();

  console.log('Load something else too, like a socket.io server or MQTT and others');

  instance.myFn = myFn;
}

try {
  loadApp();
} catch (e) {
  console.error(e);
  process.exit(1);
}
