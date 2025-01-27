import { EventController } from '@/controllers/event.controller';
import { validateEventBody } from '@/middlewares/event.middleware';
import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import {
  verifyCustomerRoleMiddleware,
  verifyOrganizerRoleMiddleware,
} from '@/middlewares/role.middleware';
import { Router } from 'express';

export class EventRouter {
  private router: Router;
  private eventsController: EventController;

  constructor() {
    this.eventsController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.eventsController.getAllEvents);
    this.router.get(
      '/my-events',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.eventsController.getAllMyEvents,
    );
    this.router.post(
      '/my-events',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      validateEventBody,
      this.eventsController.createEvent,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
