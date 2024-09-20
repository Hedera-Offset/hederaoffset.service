import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { deviceService } from '../services';
import { randomUUID } from 'crypto';

const createDevice = catchAsync(async (req, res) => {
  const {
    country,
    region,
    city,
    category,
    manufacturer,
  } = req.body;

  const user: any = req.user;

  const accountId = randomUUID();
  const accountKey = randomUUID();
  const publicKey = randomUUID();
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
