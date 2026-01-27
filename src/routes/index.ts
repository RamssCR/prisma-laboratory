import { Router } from 'express';
import { router as userRouter } from './user';
import { router as authRouter } from './auth';
import { router as categoryRouter } from './category';
import { router as brandRouter } from './brand';

export const router = Router();

router.use('/auth', authRouter);
router.use('/brands', brandRouter);
router.use('/categories', categoryRouter);
router.use('/users', userRouter);
