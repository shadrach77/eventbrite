import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { ErrorHandler } from '@/helpers/error.handler';

export class EventController {
  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await prisma.event.findMany();

      if (!data) {
        throw new ErrorHandler('No events found', 404);
      }

      return res.status(200).send({
        message: `Successfully fetched all events.`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMyEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await prisma.event.findMany({
        where: { organizer_id: req.user?.id },
      });
      res.status(200).send({
        message: `Events for organizer with id ${req.user?.id} successfully fetched`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
    } catch (error) {
      next(error);
    }
  }
}
