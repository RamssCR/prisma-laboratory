import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '#controllers/category';
import { validate } from '#middlewares/schema';
import { idParams } from '#schemas/idParam';
import { nameSchema } from '#schemas/name';
import { Router } from 'express';

export const router = Router();

router.post('/', validate(nameSchema), createCategory);
router.get('/', getCategories);
router.get('/:id', validate(idParams, { target: 'params' }), getCategoryById);
router.patch(
  '/:id',
  [
    validate(idParams, { target: 'params' }),
    validate(nameSchema, { mode: 'partial' }),
  ],
  updateCategory,
);
router.delete('/:id', validate(idParams, { target: 'params' }), deleteCategory);
