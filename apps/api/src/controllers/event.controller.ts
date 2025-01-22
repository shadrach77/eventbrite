import { Request, Response } from 'express';
import prisma from '@/prisma';
import { ErrorHandler } from '@/helpers/error.handler';

export class EventController {
  async getAllEvents(req: Request, res: Response) {
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
      throw new Error(`Failed to fetch all events.`);
    }
  }
}
