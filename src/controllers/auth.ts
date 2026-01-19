import type { RequestHandler } from 'express';
import {
  register as registerService,
  login as loginService,
} from '#services/auth';
import { NODE_ENV } from '#config/environment';
import { ONE_DAY, SEVEN_DAYS } from '#utils/constants';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { tokens, user } = await registerService(req.body);

    res
      .cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: ONE_DAY,
      })
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: SEVEN_DAYS,
      })
      .json({
        success: true,
        message: 'Logged in successfully',
        data: { user, tokens },
      });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { tokens, user } = await loginService(req.body);

    res
      .cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: ONE_DAY,
      })
      .cookie('refeshTokeb', tokens.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: SEVEN_DAYS,
      })
      .json({
        success: true,
        message: 'Logged in successfully',
        data: { user, tokens },
      });
  } catch (error) {
    next(error);
  }
};
