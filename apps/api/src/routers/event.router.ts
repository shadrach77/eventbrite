import { EventController } from '@/controllers/event.controller';
import { uploader } from '@/helpers/multer';
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
    this.router.get('/my-events/:id', this.eventsController.getMyEventById);
    this.router.post(
      '/my-event-picture',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      uploader().single('picture'),
      this.eventsController.uploadEventPicture,
    );
    this.router.delete(
      '/my-event-picture',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.eventsController.deleteEventPicture,
    );
    this.router.post(
      '/my-events',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      validateEventBody,
      this.eventsController.createEvent,
    );

    this.router.delete(
      '/my-events',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.eventsController.deleteEvent,
    );

    this.router.patch(
      '/my-events/:id',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      validateEventBody,
      this.eventsController.updateEvent,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
