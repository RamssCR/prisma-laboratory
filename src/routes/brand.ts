import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from '#controllers/brand';
import { validate } from '#middlewares/schema';
import { verifyToken } from '#middlewares/verifyToken';
import { idParams } from '#schemas/idParam';
import { nameSchema } from '#schemas/name';
import { Router } from 'express';

export const router = Router();

router.post('/', [verifyToken, validate(nameSchema)], createBrand);
router.get('/', getBrands);
router.get('/:id', validate(idParams, { target: 'params' }), getBrandById);
router.patch(
  '/:id',
  [
    verifyToken,
    validate(idParams, { target: 'params' }),
    validate(nameSchema, { mode: 'partial' }),
  ],
  updateBrand,
);
router.delete(
  '/:id',
  [verifyToken, validate(idParams, { target: 'params' })],
  deleteBrand,
);
