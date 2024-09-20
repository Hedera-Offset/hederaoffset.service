import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { deviceValidation } from '../../validations';
import { deviceController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageDevice'), validate(deviceValidation.createDevice), deviceController.createDevice)
  .get(auth('getDevices'), validate(deviceValidation.getDevices), deviceController.getDevices);

router
  .route('/:deviceId')
  .get(auth('getDevices'), validate(deviceValidation.getDevice), deviceController.getDevice)
  .delete(auth('manageDevice'), validate(deviceValidation.deleteDevice), deviceController.deleteDevice);

export default router;

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management and retrieval
 */

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Create a Device
 *     description: Only company can create other users.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *               - region
 *               - city
 *               - category
 *               - manufacturer
 *             properties:
 *               country:
 *                 type: string
 *               region:
 *                 type: string
 *               city:
 *                 type: string
 *               category:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *             example:
 *               country: India
 *               region: Maharashtra
 *               city: Nagpur
 *               category: Solar
 *               manufacturer: Hedera-Offset
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Devices
 *     description: Anyone can get the Devices.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         description: company id
 *       - in: query
 *         name: accountId
 *         schema:
 *           type: string
 *         description: account id of the device
 *       - in: query
 *         name: publicKey
 *         schema:
 *           type: string
 *         description: public key of the device
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /devices/{id}:
 *   get:
 *     summary: Get a device
 *     description: 
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 * 
 *   delete:
 *     summary: Delete a Device
 *     description:
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
