import { Router } from 'express';
import { router as userRouter } from '#routes/user';

export const router = Router();

router.use('/auth', userRouter);
