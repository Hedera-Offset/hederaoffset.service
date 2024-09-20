import { User, Role, Prisma, Device } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';


const createDevice = async (
    userId: number,
    country: string,
    region: string,
    city: string,
    category: string,
    manufacturer: string,
    accountId: string,
    accountKey: string,
    publicKey: string

): Promise<Device> => {
    if (await getDeviceByAccountId(accountId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Device already taken');
    }
    return prisma.device.create({
        data: {
            userId,
            country,
            region,
            city,
            category,
            manufacturer,
            accountId,
            accountKey,
            publicKey
        }
    });
};


const queryDevices = async <Key extends keyof Device>(
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    },
    keys: Key[] = [
        'id',
        'country',
        'region',
        'city',
        'category',
        'manufacturer',
        'accountId',
        'accountKey',
        'publicKey'
    ] as Key[]
): Promise<Pick<Device, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const devices = await prisma.device.findMany({
        where: filter,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : undefined
    });
    return devices as Pick<Device, Key>[];
};


const getDeviceById = async <Key extends keyof Device>(
    id: number,
    keys: Key[] = [
        'id',
        'country',
        'region',
        'city',
        'category',
        'manufacturer',
        'accountId',
        'accountKey',
        'publicKey'
    ] as Key[]
): Promise<Pick<Device, Key> | null> => {
    return prisma.device.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Device, Key> | null>;
};


const getDeviceByAccountId = async <Key extends keyof Device>(
    accountId: string,
    keys: Key[] = [
        'id',
        'country',
        'region',
        'city',
        'category',
        'manufacturer',
        'accountId',
        'accountKey',
        'publicKey'
    ] as Key[]
): Promise<Pick<Device, Key> | null> => {
    return prisma.device.findUnique({
        where: { accountId },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Device, Key> | null>;
};


const deleteDeviceById = async (deviceId: number): Promise<Device> => {
    const device = await getDeviceById(deviceId);
    if (!device) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
    }
    await prisma.user.delete({ where: { id: device.id } });
    return device;
};

export default {
    createDevice,
    queryDevices,
    getDeviceById,
    getDeviceByAccountId,
    deleteDeviceById
};
