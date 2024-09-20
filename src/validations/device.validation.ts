import Joi from 'joi';

const createDevice = {
  body: Joi.object().keys({
    deviceAuthToken: Joi.string(),
    country: Joi.string().required(),
    region: Joi.string().required(),
    city: Joi.string().required(),
    category: Joi.string().required(),
    manufacturer: Joi.string().required(),
  })
};

const getDevices = {
  query: Joi.object().keys({
    userId: Joi.number().integer(), 
    accountId: Joi.string(),
    publicKey: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getDevice = {
  params: Joi.object().keys({
    deviceId: Joi.number().integer()
  })
};

const deleteDevice = {
  params: Joi.object().keys({
    deviceId: Joi.number().integer()
  })
};

export default {
  createDevice,
  getDevices,
  getDevice,
  deleteDevice
};
