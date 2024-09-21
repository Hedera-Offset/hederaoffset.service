import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { deviceService } from '../services';
import { randomUUID } from 'crypto';
import { generateAccount } from '../utils/hedera/device-creation';
import * as env from "../config/config";
import prisma from '../client';
import { hcs_submit_message } from '../utils/hedera/publish-hcs';

const createDevice = catchAsync(async (req, res) => {
  const {
    deviceAuthToken,
    country,
    region,
    city,
    category,
    manufacturer,
  } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      machineAuthToken: deviceAuthToken
    }
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Auth Token');
  }
  
  // register device on hedera network
  const [accountId,accountKey,publicKey] = await generateAccount(env.default.hedera.account_id,env.default.hedera.account_private_key);

  
  const device = await deviceService.createDevice(
    user.id,
    country,
    region,
    city,
    category,
    manufacturer,
    accountId,
    accountKey,
    publicKey
  );
  res.status(httpStatus.CREATED).send(device);
});

const getDevices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'accountId', 'publicKey']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await deviceService.queryDevices(filter, options);
  res.send(result);
});

const getDevice = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceById(req.params.deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  res.send(device);
});

const deleteDevice = catchAsync(async (req, res) => {
  await deviceService.getDeviceById(req.params.deviceId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createDevice,
  getDevices,
  getDevice,
  deleteDevice
};
