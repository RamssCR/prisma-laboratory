import { createUser, getUsers } from '#controllers/user';
import { validate } from '#middlewares/schema';
import { userSchema } from '#schemas/user';
import { Router } from 'express';

export const router = Router();

router.post('/register', validate(userSchema), createUser);
router.get('/', getUsers);
