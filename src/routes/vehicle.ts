import {
  createVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from '#controllers/vehicle';
import { validate } from '#middlewares/schema';
import { verifyToken } from '#middlewares/verifyToken';
import { idParams } from '#schemas/idParam';
import { vehicleSchema } from '#schemas/vehicle';
import { Router } from 'express';

export const router = Router();

router.post('/', [verifyToken, validate(vehicleSchema)], createVehicle);
router.get('/', getVehicles);
router.get('/:id', validate(idParams, { target: 'params' }), getVehicle);
router.patch(
  '/:id',
  [
    verifyToken,
    validate(idParams, { target: 'params' }),
    validate(vehicleSchema, { mode: 'partial' }),
  ],
  updateVehicle,
);
router.delete('/:id', [verifyToken, validate(idParams, { target: 'params' })]);
