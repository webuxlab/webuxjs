/**
 * File: user.js
 * Author: Tommy Gingras
 * Date: 2019-07-09
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const Joi = require("@hapi/joi");

const Create = Joi.object()
  .keys({
    fullname: Joi.string().required()
  })
  .required();

const Update = Joi.object()
  .keys({
    fullname: Joi.string().required()
  })
  .required();

const MongoID = Joi.string()
  .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
  .required();

module.exports = {
  Create,
  Update,
  MongoID
};
