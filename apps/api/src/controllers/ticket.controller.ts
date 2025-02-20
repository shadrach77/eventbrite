import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { ILogin } from '@/interfaces/user.interface';
import { startOfDay } from 'date-fns';

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
        message: `Fetched all ticket_types with organizer ID ${id}`,
        data: allMyTickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMyTicketsByEventId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.user as ILogin;
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(401).send({
        message:
          "Couldn't fetch all ticket types by event ID without an event ID.",
      });
    }

    const myTicketTypes = await prisma.ticketType.findFirst({
      where: { event_id: req.params.eventId },
      include: { event: true },
    });

    if (!myTicketTypes) {
      return res.status(404).send({
        message: `Couldn't find a ticket type of event under ID ${eventId}`,
      });
    }

    if (myTicketTypes?.event.organizer_id !== id) {
      return res.status(403).send({
        message: `You do not have permission to get this ticket_type details`,
      });
    }

    const data = await prisma.ticketType.findMany({
      where: { event_id: req.params.eventId },
    });

    if (!data.length) {
      return res.status(404).send({
        message: `You don't have any ticket type under event id ${eventId}.`,
      });
    }

    res.status(201).send({
      message: `Successfully fetched all ticket types under event_id ${eventId}.`,
      data: data,
    });
  }

  async getMyTicketById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id || typeof String(req.params.id) !== 'string') {
        return res.status(401).send({
          message:
            'Fetch failed. ID is required to fetch a specific ticket_type.',
        });
      }

      const thisTicket = await prisma.ticketType.findUnique({
        where: { id: req.params.id },
        include: { event: true },
      });

      if (!thisTicket) {
        return res.status(404).send({
          message: `Ticket_type with ID ${req.params.id} not found`,
        });
      }

      const data = await prisma.ticketType.findUnique({
        where: { id: req.params.id },
      });

      res.status(200).send({
        message: `Successfully fetched ticket_type with ID ${req.params.id}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const existingTicket = await prisma.ticketType.findFirst({
        where: {
          title: req.body.title,
          event_id: req.body.event_id,
        },
      });

      if (existingTicket) {
        return res.status(401).send({
          message: `Failed to create ticket_type with title ${req.body.title} because another ticket_type with the same name already exist for this event`,
        });
      }

      const eventDetails = await prisma.event.findUnique({
        where: {
          id: req.body.event_id,
        },
      });

      if (!eventDetails) {
        return res.status(404).send({ message: 'Event not found.' });
      }

      if (
        startOfDay(new Date(req.body.start_date)) <
          startOfDay(new Date(String(eventDetails?.start_date))) ||
        startOfDay(new Date(req.body.end_date)) >
          startOfDay(new Date(String(eventDetails?.end_date)))
      ) {
        return res.status(403).send({
          message: `Ticket start date and end date must be within the event's start and end date.`,
        });
      }

      const data = await prisma.ticketType.create({
        data: {
          ...req.body,
          start_date: new Date(req.body.start_date),
          end_date: new Date(req.body.end_date),
        },
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

      const eventDetails = await prisma.event.findUnique({
        where: {
          id: req.body.event_id,
        },
      });

      if (!eventDetails) {
        return res.status(404).send({ message: 'Event not found.' });
      }

      if (
        startOfDay(new Date(req.body.start_date)) <
          startOfDay(new Date(String(eventDetails?.start_date))) ||
        startOfDay(new Date(req.body.end_date)) >
          startOfDay(new Date(String(eventDetails?.end_date)))
      ) {
        return res.status(403).send({
          message: `Ticket start date and end date must be within the event's start and end date.`,
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
