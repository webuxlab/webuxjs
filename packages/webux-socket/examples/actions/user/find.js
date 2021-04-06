// helper
const timeout = ms => new Promise(res => setTimeout(res, ms));

// action
const find = () => {
  return new Promise(async (resolve, reject) => {
    console.log("Start the search of the entry");
    console.log("then wait 2 seconds");
    await timeout(2000);
    return resolve({ msg: "Success !", users: ["1", "2", "3", "4", "5"] });
  });
};

// route
const route = async (req, res, next) => {
  try {
    const obj = await find();
    if (!obj) {
      return next(new Error("User not found."));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket with auth

const socket = (socket, io) => {
  return async () => {
    console.log("findUser called !");
    try {
      const obj = await find().catch(e => {
        console.error(e);
        throw e;
      });
      if (!obj) {
        console.error("No Object");
        throw new Error("Users not found");
      }

      console.log("User Found !");
      socket.emit("userFound", obj); // to only the client
      //io.emit("userFound", obj); // to everyone
    } catch (e) {
      console.error(e);
      socket.emit("gotError", e.message);
    }
  };
};

module.exports = {
  find,
  route,
  socket
};
