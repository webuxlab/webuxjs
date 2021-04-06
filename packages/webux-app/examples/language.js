const express = require("express");
const path = require("path");
const app = express();
const WebuxApp = require("../src/index");

const options = {
  configuration: path.join(__dirname, "config"),
};

const webuxApp = new WebuxApp(options);

webuxApp.LoadConfiguration();

const i18n = webuxApp.ConfigureLanguage();

app.use(webuxApp.I18nOnRequest());

app.get("/", (req, res) => {
  console.log(webuxApp.i18n.getLocale());

  res.status(200).send({ msg: res.__("MSG_BONJOUR"), lang: i18n.getLocale() });
});

app.listen(1337, () => {
  console.log("Server is listening on port 1337");
});
