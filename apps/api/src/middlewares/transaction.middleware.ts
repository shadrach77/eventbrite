import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const transactionTicketSchema = z.object({
  id: z.string().optional(),
  transaction_id: z.string().optional(),
  ticket_id: z.string(),
  quantity: z.number(),
});

const transactionSchema = z.object({
  id: z.string().optional(),
  event_id: z.string(),
  payment_proof: z.string().optional(),
  use_points_boolean: z.boolean(),
  promotion_id: z.string().optional(),
  tickets: z.array(transactionTicketSchema).optional(),
});

export const validateTransactionBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    transactionSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid request body',
      details: error instanceof z.ZodError ? error.errors : error,
    });
  }
};
