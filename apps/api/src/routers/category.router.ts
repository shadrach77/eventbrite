import { CategoryController } from '@/controllers/category.controller';
import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import { verifyOrganizerRoleMiddleware } from '@/middlewares/role.middleware';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.categoryController.getAllCategories);
    this.router.post(
      '/',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.categoryController.createCategory,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
