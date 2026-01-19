import { Router } from 'express';
import { router as userRouter } from './user';
import { router as authRouter } from './auth';

export const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
