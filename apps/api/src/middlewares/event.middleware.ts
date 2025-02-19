import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const eventSchema = z.object({
  id: z.string().optional(),
  category_id: z.string(),
  location_id: z.string(),
  title: z.string(),
  start_date: z.string().refine(
    (val) => {
      const startDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize time to midnight
      return startDate >= today; // Allows today or later
    },
    {
      message: 'Start date must be today or later',
    },
  ),
  end_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: 'Invalid end date',
  }),
  description: z.string(),
  picture: z.string().nullable().optional(),
});

export const validateEventBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (new Date(req.body.end_date) < new Date(req.body.start_date)) {
      throw new Error('End date cannot be before start date');
    }
    eventSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid request body',
      details: error instanceof z.ZodError ? error.errors : error,
    });
  }
};
