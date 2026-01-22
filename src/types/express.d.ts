import 'express';
import type { DecodedToken } from '#libs/jwt';
import type { Payload } from './jwt';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: DecodedToken<Payload>;
  }
}
