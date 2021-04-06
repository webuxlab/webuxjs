module.exports = {
  isEnabled: false,
  host: process.env.MAIL_URL || "",
  port: process.env.MAIL_PORT || "",
  useSSL: process.env.MAIL_SSL || true,
  user: process.env.MAIL_USER || "",
  password: process.env.MAIL_PASSWORD || ""
};
