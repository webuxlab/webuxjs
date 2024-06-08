import Joi from 'joi';

export const Post = Joi.object()
  .keys({
    client_name: Joi.string().required(),
    description: Joi.string().optional(),
    api_key_length: Joi.number().optional(),
    daily_limit: Joi.number().optional(),
  })
  .required();
