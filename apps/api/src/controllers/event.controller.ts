import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { ErrorHandler } from '@/helpers/error.handler';
import { cloudinaryRemove, cloudinaryUpload } from '@/helpers/cloudinary';
import { ILogin } from '@/interfaces/user.interface';

export class EventController {
  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.location_id && req.query.category_id) {
        const data = await prisma.event.findMany({
          where: {
            location_id: String(req.query.location_id),
            category_id: String(req.query.category_id),
          },
        });

        return res.status(200).send({
          message: `Successfully fetched all events with location_id ${req.query.location_id} and category_id ${req.query.category_id}.`,
          data: data,
        });
      }

      if (req.query.location_id && !req.query.category_id) {
        const data = await prisma.event.findMany({
          where: {
            location_id: String(req.query.location_id),
          },
        });

        return res.status(200).send({
          message: `Successfully fetched all events with location_id ${req.query.location_id}.`,
          data: data,
        });
      }

      if (!req.query.location_id && req.query.category_id) {
        const data = await prisma.event.findMany({
          where: {
            category_id: String(req.query.category_id),
          },
        });

        return res.status(200).send({
          message: `Successfully fetched all events with category_id ${req.query.category_id}.`,
          data: data,
        });
      }

      const data = await prisma.event.findMany();

      return res.status(200).send({
        message: `Successfully fetched all events.`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEventsByLocationId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { location_id } = req.params;

      if (!location_id) {
        res.status(401).send({
          message: `Failed to fetched events byu location ID because 'location_id' is missing as a param`,
        });
      }

      const data = await prisma.event.findMany({
        where: {
          location_id: location_id,
        },
      });

      if (!data) {
        res.status(400).send({
          message: `No events found with location_id ${location_id}.`,
        });
      }

      return res.status(200).send({
        message: `Successfully fetched all events with location_id ${location_id}.`,
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
