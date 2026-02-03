import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '#controllers/user';
import { validate } from '#middlewares/schema';
import { verifyToken } from '#middlewares/verifyToken';
import { idParams } from '#schemas/idParam';
import { userSchema } from '#schemas/user';
import { Router } from 'express';

export const router = Router();

router.post('/', [verifyToken, validate(userSchema)], createUser);
router.get('/', getUsers);
router.patch(
  '/:email',
  [
    verifyToken,
    validate(userSchema, { target: 'params', mode: 'partial' }),
    validate(userSchema.omit({ password: true }), { mode: 'partial' }),
  ],
  updateUser,
);
router.delete(
  '/:id',
  [verifyToken, validate(idParams, { target: 'params' })],
  deleteUser,
);
