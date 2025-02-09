import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { ILogin } from '@/interfaces/user.interface';

export class TicketController {
  async getAllMyTickets(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user as ILogin;
    try {
      const allMyTickets = await prisma.ticketType.findMany({
        where: {
          event: {
            organizer_id: id,
          },
        },
      });

      return res.status(200).send({
        message: `Fetched all ticket_types with ID ${id}`,
        data: allMyTickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const existingEvent = await prisma.ticketType.findFirst({
        where: {
          ...req.body,
          start_date: new Date(req.body.start_date),
          end_date: new Date(req.body.end_date),
        },
      });

      if (existingEvent) {
        return res.status(401).send({
          message: `Failed to create ticket_type with title ${req.body.title} because another ticket_type with the same name already exist for this event`,
        });
      }

      const data = await prisma.ticketType.create({
        data: req.body,
      });

      res.status(200).send({
        message: `Created ticket_type with title ${req.body.title} created.`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user as ILogin;

      if (!req.params.id || typeof String(req.params.id) !== 'string') {
        return res.status(401).send({
          message: 'Update failed. ID is required to update a ticket_type.',
        });
      }

      const thisTicket = await prisma.ticketType.findUnique({
        where: { id: String(req.params.id) },
        include: { event: true },
      });

      if (!thisTicket) {
        return res.status(404).send({
          message: `Ticket_type with ID ${req.params.id} not found`,
        });
      }

      if (thisTicket?.event.organizer_id !== id) {
        return res.status(403).send({
          message: `You do not have permission to update this ticket_type`,
        });
      }

      const data = await prisma.ticketType.update({
        data: {
          ...req.body,
          start_date: new Date(req.body.start_date),
          end_date: new Date(req.body.end_date),
        },
        where: { id: String(req.params.id) },
      });

      res.status(200).send({
        message: `Ticket_type with ID ${req.params.id} updated successfully`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user as ILogin;

    if (!req.params.id || typeof String(req.params.id) !== 'string') {
      return res.status(401).send({
        message: 'Deletion failed. ID is required to delete a ticket_type.',
      });
    }

    const thisTicket = await prisma.ticketType.findUnique({
      where: { id: String(req.params.id) },
      include: { event: true },
    });

    if (!thisTicket) {
      return res.status(404).send({
        message: `Ticket_type with ID ${req.params.id} not found`,
      });
    }

    if (thisTicket?.event.organizer_id !== id) {
      return res.status(403).send({
        message: `You do not have permission to delete this ticket_type`,
      });
    }

    const data = await prisma.ticketType.delete({
      where: { id: req.params.id },
    });

    res.send({
      message: `Ticket_type with ID ${req.params.id} has been deleted successfully.`,
      data: data,
    });
  }
}
