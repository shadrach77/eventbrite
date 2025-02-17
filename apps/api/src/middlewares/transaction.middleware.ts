import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const transactionSchema = z.object({
  id: z.string().optional(),
  customer_id: z.string(),
  payment_proof: z.string().optional(),
  points_used: z.number().optional(),
  grand_total: z.number().optional(),
  promotion_id: z.string().optional(),
  status: z.string().optional(),
  payment_proof_deadline: z
    .string()
    .transform((val) => new Date(val).toISOString)
    .optional(),
  acceptance_deadline: z
    .string()
    .transform((val) => new Date(val).toISOString)
    .optional(),
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
