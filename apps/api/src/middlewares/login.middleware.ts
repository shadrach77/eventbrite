import { Request, Response, NextFunction } from 'express';

export const validateLoginBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Incomplete user data. Please provide both email and password.',
    });
  }

  next();
};
