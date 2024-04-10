import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().required().valid('dev', 'prod', 'test').default('dev'),
  SERVER_PORT: Joi.number().required().port().default(3000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.number().required(),
});
