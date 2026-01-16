import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '#controllers/user';
import { validate } from '#middlewares/schema';
import { idParams } from '#schemas/idParam';
import { userSchema } from '#schemas/user';
import { Router } from 'express';

export const router = Router();

router.post('/', validate(userSchema), createUser);
router.get('/', getUsers);
router.patch(
  '/:email',
  [
    validate(userSchema, { target: 'params', mode: 'partial' }),
    validate(userSchema.omit({ password: true }), { mode: 'partial' }),
  ],
  updateUser,
);
router.delete('/:id', validate(idParams, { target: 'params' }), deleteUser);
