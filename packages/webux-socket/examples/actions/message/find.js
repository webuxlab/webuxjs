// helper
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

// action
const find = () => new Promise(async (resolve, reject) => {
  console.log('Start searching for messages');
  console.log('then wait 3 seconds');
  await timeout(3000);
  return reject(new Error('No messages found !'));
});

// route
const route = async (req, res, next) => {
  try {
    const obj = await find();
    if (!obj) {
      return next(new Error('Message not found.'));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket
const socket = (client, io) => async () => {
  console.log('findMessage called !');
  try {
    const obj = await find().catch((e) => {
      throw e;
    });
    if (!obj) {
      throw new Error('Messages not found');
    }

    console.log('Messages Found !');
    io.emit('messageFound', obj);
  } catch (e) {
    console.error(e);
    client.emit('gotError', e.message);
  }
};

module.exports = {
  find,
  route,
  socket,
};
