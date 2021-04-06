// █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║
// ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║
// ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
// ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

/**
 * File: test 1.js
 * Author: Tommy Gingras
 * Date: 2019-08-13
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const router = express.Router();
const {
  PrepareFile,
  DeleteFile,
  fileUploadMiddleware,
} = require("../../index");
const options = require("./config/upload");



app.use(cors());

router["get"]("/download/:id", downloadRoute);
router["post"]("/upload", fileUploadMiddleware(options), uploadRoute);

app.use(router);

app.listen(1337, () => {
  console.log("Server is listening on port 1337 ...");
});
