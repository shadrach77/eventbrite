import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { ErrorHandler } from '@/helpers/error.handler';
import { cloudinaryRemove, cloudinaryUpload } from '@/helpers/cloudinary';
import { ILogin } from '@/interfaces/user.interface';

export class EventController {
  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    if (!req.body.id || typeof String(req.body.id) !== 'string') {
      return res.status(400).send({
        message: `Failed to create category due to incorrect body`,
      });
    }

    try {
      const data = await prisma.event.findUnique({
        where: { id: String(req.body.id) },
      });

      if (!data) {
        throw new ErrorHandler(`No event with ID ${req.body.id} found`, 404);
      }

      return res.status(200).send({
        message: `Successfully fetched event with ID ${req.body.id}.`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyEventById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    console.log('token =>', req.headers.authorization);
    try {
      const data = await prisma.event.findUnique({
        where: { id: id },
      });

      if (!data) {
        return res.status(404).send({ message: 'Event not found' });
      }

      return res.status(200).send({
        message: `Successfully fetched event with ID ${id}.`,
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
    if (!file) {
      return res.status(400).send({
        message: "There's no image to upload.",
      });
    }

    const { secure_url } = await cloudinaryUpload(file);

    res.status(201).send({
      message: `Image with link ${secure_url} successfully uploaded.`,
      data: secure_url,
    });
  }

  async deleteEventPicture(req: Request, res: Response, next: NextFunction) {
    const { link } = req.body;
    if (!link) {
      return res.status(400).send({
        message: "There's no image to upload.",
      });
    }

    const { secure_url } = await cloudinaryRemove(String(link));

    res.status(201).send({
      message: `Image with link ${link} successfully deleted.`,
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

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user as ILogin;

    if (!req.params.id || typeof req.params.id !== 'string') {
      res.status(401).send({
        message: `Update failed. ID is required to update an event.`,
      });
    }

    const data = await prisma.event.update({
      data: {
        ...req.body,
        organizer_id: String(id),
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
      },
      where: { id: String(req.params.id) },
    });

    res.status(200).send({
      message: `Event with ID ${req.body.id} updated successfully`,
      data: data,
    });
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;

    if (!id || typeof id !== 'string') {
      res.status(401).send({
        message: 'Deletion failed. ID is required to delete an event.',
      });
    }

    const data = await prisma.event.delete({
      where: { id: id },
    });

    res.send({
      message: `Event with ID ${id} has been deleted successfully.`,
      data: data,
    });
  }
}
