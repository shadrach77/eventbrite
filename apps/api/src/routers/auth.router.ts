import { AuthController } from '@/controllers/auth.controller';
import { validateLoginBody } from '@/middlewares/login.middleware';
import { validateRegisterBody } from '@/middlewares/register.middleware';
import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import {
  verifyOrganizerRoleMiddleware,
  verifyCustomerRoleMiddleware,
} from '@/middlewares/role.middleware';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/profile', validateLoginBody, this.authController.login);
    this.router.post(
      '/profile/new',
      validateRegisterBody,
      this.authController.register,
    );
    this.router.get(
      '/test',
      verifyJwtMiddleware,
      verifyCustomerRoleMiddleware,
      this.authController.test,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
