import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { ErrorHandler } from '@/helpers/error.handler';
import { cloudinaryRemove, cloudinaryUpload } from '@/helpers/cloudinary';

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

  async uploadEventPicture(req: Request, res: Response, next: NextFunction) {
    const { file } = req;
    if (!file) throw new Error('No File Uploaded');

    const { secure_url } = await cloudinaryUpload(file);

    res.status(201).send({
      message: `Image with link ${secure_url} successfully uploaded.`,
      data: secure_url,
    });
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const existingEvent = await prisma.event.findFirst({
        where: { title: req.body.title },
      });

      if (existingEvent) {
        return res.status(400).send({
          message: `Event with title ${req.body.title} has already been taken for this account. Please use another title or delete the existing event.`,
        });
      }

      const newEvent = await prisma.event.create({
        data: {
          ...req.body,
          organizer_id: req.user?.id,
          start_date: new Date(req.body.start_date),
          end_date: new Date(req.body.end_date),
        },
      });
      res.status(200).send({
        message: 'Event created successfully',
        data: newEvent,
      });
    } catch (error) {
      next(error);
    }
  }
}
