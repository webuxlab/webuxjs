const cluster = require('cluster');

// helper
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

// action
const createProfile = (body) => new Promise(async (resolve, reject) => {
  if (!body) {
    console.log('No Body !');
    return reject(new Error('Body is not present !'));
  }
  console.log('Start the creation of the entry');
  console.log('then wait 2 seconds');
  await timeout(2000);
  return resolve({
    msg: 'Success !',
    cluster: cluster && cluster.worker ? cluster.worker.id : 'Single Node',
  });
});

// route
const route = async (req, res, next) => {
  try {
    const obj = await createProfile(req.body);
    if (!obj) {
      return next(new Error('Profile not created.'));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket with auth

const socket = (client, io) => async (body) => {
  console.log('called !');
  try {
    const obj = await createProfile(body).catch((e) => {
      console.error(e);
      throw e;
    });
    if (!obj) {
      console.error('No Object');
      throw new Error('Profile not created');
    }

    console.log('Profile Created !');
    io.emit('profileCreated', obj);
    // client.emit("profileCreated", obj); // to broadcast to only the client
  } catch (e) {
    console.error(e);
    client.emit('gotError', e.message);
  }
};

module.exports = {
  createProfile,
  socket,
  route,
};
