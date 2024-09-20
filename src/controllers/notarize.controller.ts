import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { deviceService, notarizedDataService } from '../services';
import { randomUUID } from 'crypto';
import PinataClient from "@pinata/sdk"
import dotenv from "dotenv";
import * as env from "../config/config";
import { mint } from '../utils/hedera/carbon-mint';

dotenv.config();
const pinata = new PinataClient({ pinataApiKey: env.default.pinata.api_key, pinataSecretApiKey: env.default.pinata.secret });

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

    const notarization = await notarizedDataService.createNotarization(
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

    const device = await deviceService.getDeviceById(deviceId);
    console.log( env.default.hedera.token,
        env.default.hedera.account_id,
        env.default.hedera.account_private_key,
        device?.accountId!,
        device?.accountKey!)
    // mint carbon token on notarization
    await mint(
        pinata,
        env.default.hedera.token,
        env.default.hedera.account_id,
        env.default.hedera.account_private_key,
        device?.accountId!,
        device?.accountKey!
    );

    res.status(httpStatus.CREATED).send(notarization);
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
