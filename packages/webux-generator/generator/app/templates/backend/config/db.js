const path = require("path");

module.exports = {
  sort: [],
  local: process.env.DB_LOCAL && process.env.DB_LOCAL == "false" ? false : true,
  localPort: 27017,
  debug: process.env.DB_DEBUG && process.env.DB_DEBUG == "false" ? false : true,
  URL: process.env.DB_URL || "@127.0.0.1:27017/framework",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  modelDir: path.join(__dirname, "..", "models"),
  advanced: {
    keepAlive: 300000,
    socketTimeoutMS: 30000,
    replicaSet: process.env.DB_REPLSET || "",
    autoIndex: true,
    useNewUrlParser: true,
    reconnectTries: 30,
    useUnifiedTopology: true
  }
};
