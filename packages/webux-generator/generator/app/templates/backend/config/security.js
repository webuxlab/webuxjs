module.exports = {
  origin: process.env.ORIGIN
    ? process.env.ORIGIN.split(" ")
    : ["http://localhost:8080", "http://127.0.0.1:8080"],
  bodyParser: {
    limit: "3mb",
    extended: true
  },
  cookieParser: {
    secret: process.env.COOKIE_SECRET || "SHUUUT!"
  },
  trustProxy: true,
  allowedMethods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedCredentials: true,
  allowedHeaders:
    "Origin,X-Requested-with,Accept,Authorization,Content-Type,Accept-Language"
};
