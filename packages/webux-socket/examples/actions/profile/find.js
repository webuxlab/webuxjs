// helper
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

// action
export const find = () =>
  new Promise(async (resolve, reject) => {
    console.log('Start searching for entries');
    console.log('then wait 3 seconds');
    await timeout(3000);
    return reject(new Error('No profiles found !'));
  });

// route
export const route = async (req, res, next) => {
  try {
    const obj = await find();
    if (!obj) {
      return next(new Error('Profile not found.'));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket with auth

export const socket = (client, io) => async () => {
  console.log('findProfile called !');
  try {
    const obj = await find().catch((e) => {
      throw e;
    });
    if (!obj) {
      throw new Error('Profiles not found');
    }

    console.log('Profile Found !');
    io.emit('profileFound', obj);
  } catch (e) {
    console.error(e);
    client.emit('gotError', e.message);
  }
};
