import { Request, Response, NextFunction } from 'express';
import { ILogin } from '@/interfaces/user.interface';

function roleChecker(user: ILogin | undefined) {
  if (!user || !user.role) {
    throw new Error(
      'User is invalid because it either does not exist or have no role.',
    );
  }
}

export const verifyOrganizerRoleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    roleChecker(req.user);

    if (req.user!.role !== 'ORGANIZER') {
      return res
        .status(403)
        .send(
          `You are not authorized to complete this action. You role ${req.user!.role} does not have sufficient permissions to execute 'ORGANIZER' tasks.`,
        );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyCustomerRoleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    roleChecker(req.user!);

    if (req.user!.role !== 'CUSTOMER') {
      return res
        .status(403)
        .send(
          `You are not authorized to complete this action. You role ${req.user!.role} does not have sufficient permissions to execute 'CUSTOMER' tasks.`,
        );
    }

    next();
  } catch (error) {
    next(error);
  }
};
