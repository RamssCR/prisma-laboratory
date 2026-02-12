import { createCompatibility } from '#controllers/compatibility';
import { validate } from '#middlewares/schema';
import { verifyToken } from '#middlewares/verifyToken';
import { compatibilitySchema } from '#schemas/compatibility';
import { Router } from 'express';

export const router = Router();

router.post(
  '/',
  [verifyToken, validate(compatibilitySchema)],
  createCompatibility,
);
