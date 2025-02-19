import { PromotionController } from '@/controllers/promotion.controller';
import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import { verifyOrganizerRoleMiddleware } from '@/middlewares/role.middleware';
import { validatePromotionBody } from '@/middlewares/promotion.middleware';
import { Router } from 'express';

export class PromotionRouter {
  private router: Router;
  private promotionController: PromotionController;

  constructor() {
    this.promotionController = new PromotionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.promotionController.getAllPromotionsByQuery);

    this.router.get(
      '/my-promotions',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.promotionController.getAllMyPromotions,
    );

    this.router.get(
      '/my-promotions/:id',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.promotionController.getMyPromotionById,
    );

    this.router.get(
      '/my-promotions/byEventId/:eventId',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.promotionController.getAllMyPromotionsByEventId,
    );

    this.router.post(
      '/my-promotions',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      validatePromotionBody,
      this.promotionController.createPromotion,
    );

    this.router.patch(
      '/my-promotions/:id',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      validatePromotionBody,
      this.promotionController.updatePromotion,
    );

    this.router.delete(
      '/my-promotions/:id',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.promotionController.deletePromotion,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
