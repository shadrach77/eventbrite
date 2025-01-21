import { Request, Response } from 'express';
import prisma from '@/prisma';

export class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const data = await prisma.event.findMany();
      return res.status(200).send({
        message: `Successfully fetched all events.`,
        data: data,
      });
    } catch (error) {
      throw new Error(`Failed to fetch all events.`);
    }
  }
}
