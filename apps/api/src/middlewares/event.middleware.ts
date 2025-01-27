import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const registerSchema = z.object({
  categoiry_id: z.string(),
  loaction_id: z.string(),
  title: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  description: z.string(),
  picture: z.string().optional(),
});

export const validateEventBody = (
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
