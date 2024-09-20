import { Role } from '@prisma/client';

const allRoles = {
  [Role.BUYER]: ['manageDevice','getDevices','getUsers', 'manageUsers'],
  [Role.GENERATOR]: ['getUsers', 'manageUsers','manageDevice','getDevices']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
