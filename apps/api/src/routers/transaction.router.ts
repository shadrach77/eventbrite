import { TransactionController } from '@/controllers/transaction.controller';
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
    // this.router.post('/', validateTransactionBody ,this.transactionController.createTransaction);
  }

  getRouter(): Router {
    return this.router;
  }
}
