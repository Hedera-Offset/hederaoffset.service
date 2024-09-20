import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { notarizedDataValidation } from '../../validations';
import { notarizedDataController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(validate(notarizedDataValidation.createNotarization), notarizedDataController.createNotarization)
  .get(auth('getNotarizations'), validate(notarizedDataController.getNotarizations), notarizedDataController.getNotarizations);


export default router;

/**
 * @swagger
 * tags:
 *   name: Notarization
 *   description: Device management and retrieval
 */

/**
 * @swagger
 * /notarizations:
 *   post:
 *     summary: Create a Notarization
 *     description: Only Device can create.
 *     tags: [Notarization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *             properties:
 *               deviceId:
 *                 type: string
 *               meter_type:
 *                 type: string
 *               time:
 *                 type: string
 *               temprature:
 *                 type: string
 *               totalEnergy:
 *                 type: number
 *               power:
 *                 type: number
 *               apparentPower:
 *                 type: number
 *               reactivePower:
 *                 type: number
 *               factor:
 *                 type: number
 *               voltage:
 *                 type: number
 *               current:
 *                 type: number
 *               raw:
 *                 type: string
 *             example:
 *               deviceId: 1
 *               meter_type: Sonoff
 *               time: 2024-08-19T14:30:00Z
 *               temprature: 32
 *               totalEnergy: 24
 *               today: 2
 *               power: 240
 *               apparentPower: 2
 *               reactivePower: 54
 *               factor: 32
 *               voltage: 120
 *               current: 5
 *               raw: raw json
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
 *     summary: Get all Notarization
 *     description: Anyone can get the Notarizations.
 *     tags: [Notarization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: number
 *         description: Device id to get all the notarization data associated with it
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: notarization id
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