import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { deviceService, notarizedDataService } from '../services';
import { randomUUID } from 'crypto';

const createNotarization = catchAsync(async (req, res) => {
    const {
        deviceId,
        meter_type,
        time,
        temprature,
        totalEnergy,
        today,
        power,
        apparentPower,
        reactivePower,
        factor,
        voltage,
        current,
        raw
    } = req.body;

    const device = await notarizedDataService.createNotarization(
        deviceId,
        meter_type,
        time,
        temprature,
        totalEnergy,
        today,
        power,
        apparentPower,
        reactivePower,
        factor,
        voltage,
        current,
        raw
    );
    res.status(httpStatus.CREATED).send(device);
});

const getNotarizations = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['deviceId', 'id']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await notarizedDataService.queryNotarizedData(filter, options);
    res.send(result);
});

export default {
    createNotarization,
    getNotarizations,
};
