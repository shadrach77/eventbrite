import { JWT_TOKEN_SECRET } from '@/config';
import { ILogin } from '@/interfaces/user.interface';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const verifyJwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res
        .status(401)
        .send(
          'You are not authorized to complete this action due to a lack of JWT token.',
        );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .send(
          'You are not authorized to complete this action due to a lack of JWT token.',
        );
    }

    const verifiedUser = verify(token, JWT_TOKEN_SECRET);

    if (!verifiedUser) {
      return res.status(401).send('Your JWT token is invalid.');
    }

    req.user = verifiedUser as ILogin;

    next();
  } catch (error) {
    next(error);
  }
};
