import Joi from 'joi';

const createNotarization = {
  body: Joi.object().keys({
    deviceId: Joi.number(),
    meter_type: Joi.string(),
    time: Joi.string(),
    temprature: Joi.string(),
    totalEnergy: Joi.number(),
    today: Joi.number(),
    power: Joi.number(),
    apparentPower: Joi.number(),
    reactivePower: Joi.number(),
    factor: Joi.number(),
    voltage: Joi.number(),
    current: Joi.number(),
    raw: Joi.string()
  })
};

const getNotarizations = {
  query: Joi.object().keys({
    deviceId: Joi.number().integer(),
    id: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

export default {
  createNotarization,
  getNotarizations
};
