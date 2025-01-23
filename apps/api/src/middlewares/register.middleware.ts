import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string(),
  role: z.enum(['ORGANIZER', 'CUSTOMER']),
  points: z.number().optional(),
  profile_picture: z.string().optional(),
});

export const validateRegisterBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid request body',
      details: error instanceof z.ZodError ? error.errors : error,
    });
  }
};
