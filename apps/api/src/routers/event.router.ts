import { EventController } from '@/controllers/event.controller';
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
  }

  getRouter(): Router {
    return this.router;
  }
}
