/** @format */

import { ILogin } from './user.interface';

declare global {
  namespace Express {
    export interface Request {
      user?: ILogin;
    }
  }
}
