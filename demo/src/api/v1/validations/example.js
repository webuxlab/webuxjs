import Joi from 'joi';

export const Get = Joi.object()
  .keys({
    operation: Joi.string().valid('Integer', 'MinMaxInteger').required(),
    min: Joi.alternatives().conditional('operation', {
      is: 'MinMaxInteger',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
    max: Joi.alternatives().conditional('operation', {
      is: 'MinMaxInteger',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  })
  .required();
