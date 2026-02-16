import { movement, stock } from '#controllers/inventory';
import { validate } from '#middlewares/schema';
import { verifyToken } from '#middlewares/verifyToken';
import { inventorySchema } from '#schemas/inventory';
import { searchQuery } from '#schemas/searchQuery';
import { Router } from 'express';

export const router = Router();

router.post('/', [verifyToken, validate(inventorySchema)], movement);
router.get(
  '/',
  validate(searchQuery, { target: 'query', mode: 'partial' }),
  stock,
);
