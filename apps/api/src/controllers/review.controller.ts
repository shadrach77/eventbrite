import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';

export class ReviewController {
  async getReviewById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id) {
      return res.status(404).send({
        message: `Couldn't fetch a specific review by id because id is not provided. `,
      });
    }

    const review = await prisma.review.findUnique({
      where: {
        id: id,
      },
    });

    res.status(200).send({
      message: `Successfully fetched review with id ${id}.`,
      data: review,
    });
  }
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, description, transaction_id, event_id } = req.body;
      const customer_id = req.user?.id;

      if (!req?.user?.id) {
        return res.send({
          message: `Insufficient permission. req.user.id is missing on JWT Token`,
        });
      }

      const existingReview = await prisma.review.findFirst({
        where: {
          transaction_id: transaction_id,
        },
      });

      if (existingReview) {
        return res.status(401).send({
          message: `Review for transaction with transaction_id ${transaction_id} already exist.`,
        });
      }

      const review = await prisma.review.create({
        data: {
          ...req.body,
          rating: Number(rating),
          customer_id,
        },
      });

      return res.status(201).send({
        message: `Successfully created review for transaction with transaction_id ${transaction_id}.`,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReviewByTransactionId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { transaction_id } = req.params;

      if (!transaction_id) {
        return res.status(403).send({
          message: `Cannot fetch a review from a specific transaction without 'transaction_id' as params`,
        });
      }

      const existingReview = await prisma.review.findFirst({
        where: {
          transaction_id: transaction_id,
        },
      });

      res.status(200).send({
        message: `Successfully fetched review with transaction_id ${transaction_id}.`,
        data: existingReview,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReviewsByEventId(req: Request, res: Response, next: NextFunction) {
    const { event_id } = req.params;

    if (!event_id) {
      return res.status(404).send({
        message: `Couldn't fetch reviews by event_id because event_id is not provided. `,
      });
    }

    const reviews = await prisma.review.findMany({
      where: {
        event_id: event_id,
      },
    });

    res.status(200).send({
      message: `Successfully fetched all reviews with event_id ${event_id}.`,
      data: reviews,
    });
  }
}
