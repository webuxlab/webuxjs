module.exports = {
  local: {
    username: "email",
    password: "password",
    passwordStrategy: {
      enabled: false,
      regex: "",
      message: "The password strategy is enabled and you must be compliant."
    },
    autoLogonOnRegister: true,
    autoActivate: true
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "SHUUUT!",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "SHUUUUT!",
    accessLife: 900,
    refreshLife: 86400,
    scheme: "Bearer",
    id: "_id",
    serializeUser: ["_id", "email", "profileID"]
  },
  redis: {
    mock: process.env.REDIS_MOCK && process.env.REDIS_MOCK == "false" ? false : true,
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || "6379",
    password: process.env.REDIS_PASSWORD || "",
    no_ready_check: process.env.REDIS_NO_READY_CHECK && process.env.REDIS_NO_READY_CHECK == "false" ? false : true,
  }
};
