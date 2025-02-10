import { TicketController } from '@/controllers/ticket.controller';
import { verifyJwtMiddleware } from '@/middlewares/jwt.middleware';
import { verifyOrganizerRoleMiddleware } from '@/middlewares/role.middleware';
import { validateTicketBody } from '@/middlewares/ticket.middleware';
import { Router } from 'express';

export class TicketRouter {
  private router: Router;
  private ticketController: TicketController;

  constructor() {
    this.ticketController = new TicketController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/my-tickets',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.ticketController.getAllMyTickets,
    );

    this.router.get(
      '/my-tickets/byEventId/:eventId',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.ticketController.getAllMyTicketsByEventId,
    );

    this.router.get(
      '/my-tickets/:id',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.ticketController.getMyTicketById,
    );

    this.router.post(
      '/my-tickets',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      validateTicketBody,
      this.ticketController.createTicket,
    );

    this.router.patch(
      '/my-tickets/:id',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      validateTicketBody,
      this.ticketController.updateTicket,
    );

    this.router.delete(
      '/my-tickets/:id',
      verifyJwtMiddleware,
      verifyOrganizerRoleMiddleware,
      this.ticketController.deleteTicket,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
