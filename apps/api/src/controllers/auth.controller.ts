import { JWT_TOKEN_SECRET } from '@/config';
import { hashedPassword } from '@/helpers/bcrypt';
import { ErrorHandler } from '@/helpers/error.handler';
import { getUserByEmail } from '@/helpers/user.prisma';
import { ILogin } from '@/interfaces/user.interface';
import prisma from '@/prisma';
import { compare } from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, full_name, role, profile_picture } = req.body;

      const existingUser = await getUserByEmail(String(email));

      if (existingUser) {
        return res.status(400).send({
          message: `User with email ${email} has already been registered. Please log in instead.`,
        });
      }

      let initialPoints = null;

      if (role === 'CUSTOMER') {
        initialPoints = 0;
      }

      const user = await prisma.user.create({
        data: {
          email,
          password: await hashedPassword(password),
          full_name,
          role,
          points: initialPoints,
          profile_picture,
        },
      });

      return res.status(200).send({
        message: `Registeration successful.`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = (await getUserByEmail(String(email))) as ILogin;

      if (!user) {
        return res.status(400).send({
          message: `No account with email ${email} is associated to our database. Please register to create an account, then com back to log in.`,
        });
      }

      if (!(await compare(String(password), user.password as string))) {
        return res.status(400).send({
          message: `Incorrect password. Please try again.`,
        });
      }

      delete user.password;

      // return res.send({
      //   message: `Login successful.`,
      //   data: user,
      // });

      const token = sign(user, JWT_TOKEN_SECRET, {
        expiresIn: '20m',
      });

      return res.set('Authorization', `Bearer ${token}`).status(200).send({
        message: 'Login successful',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async test(req: Request, res: Response, next: NextFunction) {
    return res.send('This is a test controller.');
  }
}
