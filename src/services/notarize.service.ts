import { Device, NotarizedData } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import * as env from "../config/config";

const createNotarization = async (
  deviceId: number,
  meter_type: string,
  time: string,
  temprature: string,
  totalEnergy: number,
  today: number,
  power: number,
  apparentPower: number,
  reactivePower: number,
  factor: number,
  voltage: number,
  current: number,
  seq_number: number
): Promise<NotarizedData> => {
  return prisma.notarizedData.create({
    data: {
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
      sequence_number: seq_number
    }
  });
};

const queryNotarizedData = async <Key extends keyof NotarizedData>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'deviceId',
    'meter_type',
    'time',
    'temprature',
    'totalEnergy',
    'today',
    'power',
    'apparentPower',
    'reactivePower',
    'factor',
    'voltage',
    'current',
    'raw'
  ] as Key[]
): Promise<Pick<NotarizedData, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const notarizedData = await prisma.notarizedData.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    // skip: (page - 1) * limit,
    // take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return notarizedData as Pick<NotarizedData, Key>[];
};

const getNotarizedDataById = async <Key extends keyof NotarizedData>(
  id: number,
  keys: Key[] = [
    'id',
    'deviceId',
    'meter_type',
    'time',
    'temprature',
    'totalEnergy',
    'today',
    'power',
    'apparentPower',
    'reactivePower',
    'factor',
    'voltage',
    'current',
    'raw'
  ] as Key[]
): Promise<Pick<NotarizedData, Key> | null> => {
  return prisma.notarizedData.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<NotarizedData, Key> | null>;
};

// const deleteDeviceById = async (deviceId: number): Promise<Device> => {
//     const device = await getDeviceById(deviceId);
//     if (!device) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
//     }
//     await prisma.user.delete({ where: { id: device.id } });
//     return device;
// };

export default {
  createNotarization,
  queryNotarizedData,
  getNotarizedDataById
};
