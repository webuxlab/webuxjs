// helper
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

// action
export const find = () =>
  new Promise(async (resolve, reject) => {
    console.log('Start searching for super private entries');
    console.log('then wait 3 seconds');
    await timeout(3000);
    return reject(new Error('No super private profiles found !'));
  });

// route
export const route = async (req, res, next) => {
  try {
    const obj = await find();
    if (!obj) {
      return next(new Error('Super Private Profile not found.'));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket
export const socket = (client, io) => async () => {
  console.log('findSuper PrivateProfile called !');
  try {
    const obj = await find().catch((e) => {
      throw e;
    });
    if (!obj) {
      throw new Error('Super Private Profiles not found');
    }

    console.log('Super Private Profile Found !');
    io.emit('superPrivateProfileFound', obj);
  } catch (e) {
    console.error(e);
    client.emit('gotError', e.message);
  }
};
