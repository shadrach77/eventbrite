import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const ticketSchema = z.object({
  id: z.string().optional(),
  event_id: z.string(),
  title: z.string(),
  price: z.number(),
  available_seats: z.number(),
  start_date: z
    .string()
    .refine(
      (val) => {
        const startDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time to midnight
        return startDate >= today; // Allows today or later
      },
      {
        message: 'Start date must be today or later',
      },
    )
    .transform((val) => new Date(val).toISOString),
  end_date: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: 'Invalid end date',
    })
    .transform((val) => new Date(val).toISOString),
});

export const validateTicketBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (new Date(req.body.end_date) < new Date(req.body.start_date)) {
      throw new Error('End date cannot be before start date');
    }
    ticketSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid request body',
      details: error instanceof z.ZodError ? error.errors : error,
    });
  }
};
