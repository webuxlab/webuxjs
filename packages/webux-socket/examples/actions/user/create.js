const cluster = require("cluster");

// helper
const timeout = ms => new Promise(res => setTimeout(res, ms));

// action
const createUser = body => {
  return new Promise(async (resolve, reject) => {
    if (!body) {
      console.log("No Body !");
      return reject(new Error("Body is not present !"));
    }
    console.log("Start the creation of the entry");
    console.log("then wait 2 seconds");
    await timeout(2000);
    return resolve({ msg: "Success !", cluster: cluster && cluster.worker ? cluster.worker.id : "Single Node" });
  });
};

// route
const route = async (req, res, next) => {
  try {
    const obj = await createUser(req.body);
    if (!obj) {
      return next(new Error("User not created."));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket with auth

const socket = (client, io) => {
  return async (body, fn) => {
    console.log("called !");
    try {
      const obj = await createUser(body).catch(e => {
        console.error(e);
        throw e;
      });
      if (!obj) {
        console.error("No Object");
        throw new Error("User not created");
      }

      console.log("User Created !");
      io.emit("userCreated", obj);
      fn(true); // it returns a callback
    } catch (e) {
      console.error(e);
      client.emit("gotError", e.message);
    }
  };
};

module.exports = {
  createUser,
  socket,
  route
};
