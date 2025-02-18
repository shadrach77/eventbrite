import { TransactionController } from '@/controllers/transaction.controller';
import { uploader } from '@/helpers/multer';
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
    this.router.get(
      '/my-transactions',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      this.transactionController.getAllMyTransactions,
    );
    this.router.get(
      '/:transaction_id',
      this.transactionController.getTransactionById,
    );
    this.router.post(
      '/',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      validateTransactionBody,
      this.transactionController.createTransaction,
    );
    this.router.post(
      '/my-transactions/picture',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      uploader().single('picture'),
      this.transactionController.uploadTransactionPicture,
    );
    this.router.patch(
      '/my-transactions/:transaction_id',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      validateTransactionBody,
      this.transactionController.updateMyTransaction,
    );
    this.router.delete(
      '/my-transactions/:transaction_id',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      this.transactionController.cancelMyTransaction,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
