import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '#controllers/product';
import { validate } from '#middlewares/schema';
import { verifyToken } from '#middlewares/verifyToken';
import { idParams } from '#schemas/idParam';
import { productSchema } from '#schemas/product';
import { searchQuery } from '#schemas/searchQuery';
import { Router } from 'express';

export const router = Router();

router.get(
  '/',
  validate(searchQuery, { target: 'query', mode: 'partial' }),
  getProducts,
);
router.get('/:id', validate(idParams, { target: 'params' }), getProduct);
router.post('/', [verifyToken, validate(productSchema)], createProduct);
router.patch(
  '/:id',
  [
    verifyToken,
    validate(idParams, { target: 'params' }),
    validate(productSchema, { mode: 'partial' }),
  ],
  updateProduct,
);
router.delete(
  '/:id',
  [verifyToken, validate(idParams, { target: 'params' })],
  deleteProduct,
);
