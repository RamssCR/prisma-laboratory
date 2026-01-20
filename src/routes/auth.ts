import { login, logout, register } from '#controllers/auth';
import { validate } from '#middlewares/schema';
import { verifyToken } from '#middlewares/verifyToken';
import { userSchema } from '#schemas/user';
import { Router } from 'express';

export const router = Router();

router.post('/register', validate(userSchema), register);
router.post(
  '/login',
  validate(userSchema.pick({ email: true, password: true })),
  login,
);
router.post('/logout', verifyToken, logout);
