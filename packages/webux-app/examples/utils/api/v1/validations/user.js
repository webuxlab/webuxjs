/**
 * File: user.js
 * Author: Tommy Gingras
 * Date: 2019-07-09
 * License: All rights reserved Studio Webux 2015-Present
 */

'use strict';

import Joi from 'joi';

export const Create = Joi.object()
  .keys({
    fullname: Joi.string().required(),
  })
  .required();

export const Update = Joi.object()
  .keys({
    fullname: Joi.string().required(),
  })
  .required();

export const MongoID = Joi.string()
  .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
  .required();
