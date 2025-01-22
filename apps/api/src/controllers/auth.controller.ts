import { ErrorHandler } from '@/helpers/error.handler';
import prisma from '@/prisma';
import { Request, Response, NextFunction } from 'express';
export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.query;

      if (!email || !password) {
        throw new ErrorHandler(
          'Incomplete user data. Please complete user data to login.',
          400,
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          email: String(email),
          password: String(password),
        },
      });

      if (!user) {
        throw new ErrorHandler('No events found', 404);
      }

      return res.send({
        message: `Login successful.`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
