import { TransactionController } from '@/controllers/transaction.controller';
import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import { verifyCustomerRoleMiddleware } from '@/middlewares/role.middleware';
import { validateTransactionBody } from '@/middlewares/transaction.middleware';
import { Router } from 'express';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      validateTransactionBody,
      this.transactionController.createTransaction,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
