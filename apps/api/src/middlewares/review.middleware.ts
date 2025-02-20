import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const reviewSchema = z.object({
  id: z.string().optional(),
  rating: z.number(),
  description: z.string(),
  event_id: z.string(),
  transaction_id: z.string(),
  customer_id: z.string().optional(),
});

export const validateReviewBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    reviewSchema.parse(req.body);

    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid request body',
      details: error instanceof z.ZodError ? error.errors : error,
    });
  }
};
