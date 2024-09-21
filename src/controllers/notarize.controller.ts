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
import { getAllNfts } from '../utils/hedera/mirror';
import prisma from '../client';
import { TokenResponse } from '../types/hedera';
import { Device } from '@prisma/client';
import { hcs_submit_message } from '../utils/hedera/publish-hcs';

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
    // mint carbon token on notarization
    await mint(
        pinata,
        env.default.hedera.token,
        env.default.hedera.account_id,
        env.default.hedera.account_private_key,
        device?.accountId!,
        device?.accountKey!
    );

    await hcs_submit_message(env.default.hedera.account_id,env.default.hedera.account_private_key, env.default.hedera.topic_id, "");

    res.status(httpStatus.CREATED).send(notarization);
});

const getNotarizations = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['deviceId', 'id']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await notarizedDataService.queryNotarizedData(filter, options);
    res.send(result);
});

const getTokens = catchAsync(async (req, res) => {
    
    const user: any = req.user;

    const devices = await prisma.device.findMany({
        where: {
            userId: user.id
        }
    })
    
    const devicePromises = devices.map(async (item) => {
        let deviceCarbonTokens = await getAllNfts(
            env.default.hedera.token,
            item.accountId
        );

        console.log(deviceCarbonTokens)
    
        return deviceCarbonTokens;
    });

    let allDeviceCarbonTokens2d = await Promise.all(devicePromises);
    let allDeviceCarbonTokens: TokenResponse[] = allDeviceCarbonTokens2d.flat();

    res.send(allDeviceCarbonTokens);
});

export default {
    createNotarization,
    getNotarizations,
    getTokens
};
