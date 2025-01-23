import { AuthController } from '@/controllers/auth.controller';
import { validateLoginBody } from '@/middlewares/login.middleware';
import { validateRegisterBody } from '@/middlewares/register.middleware';
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
  }

  getRouter(): Router {
    return this.router;
  }
}
