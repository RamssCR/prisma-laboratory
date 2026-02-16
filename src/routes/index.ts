import { Router } from 'express';
import { router as userRouter } from './user';
import { router as authRouter } from './auth';
import { router as categoryRouter } from './category';
import { router as brandRouter } from './brand';
import { router as productRouter } from './product';
import { router as inventoryRouter } from './inventory';

export const router = Router();

router.use('/auth', authRouter);
router.use('/brands', brandRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/users', userRouter);
router.use('/inventory', inventoryRouter);
