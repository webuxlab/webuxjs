module.exports = {
  Auth: {
    time: 600, // block for 10 minutes
    maxReq: 20, // after 20 requests within 1 minute
    skip: "/api/v1/auth" // if not contains that, then skip !
  },
  Global: {
    time: 60, // block for one minute
    maxReq: 150, // after 150 request within 1 minute
    skip: "/api/v1" // if not contains that, then skip !
  }
};
