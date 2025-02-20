import { ReviewController } from '@/controllers/review.controller';

import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import {
  verifyCustomerRoleMiddleware,
  verifyOrganizerRoleMiddleware,
} from '@/middlewares/role.middleware';
import { Router } from 'express';

export class ReviewRouter {
  private router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/byTransactionId/:transaction_id',
      this.reviewController.getReviewByTransactionId,
    );
    this.router.post(
      '/',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      this.reviewController.createReview,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
