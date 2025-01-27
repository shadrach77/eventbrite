import { LocationController } from '@/controllers/location.controller';
import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import { verifyOrganizerRoleMiddleware } from '@/middlewares/role.middleware';
import { Router } from 'express';

export class LocationRouter {
  private router: Router;
  private locationController: LocationController;

  constructor() {
    this.locationController = new LocationController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.locationController.getAllLocations);
    this.router.post(
      '/',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.locationController.createLocation,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
