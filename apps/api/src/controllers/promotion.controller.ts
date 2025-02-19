import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { ILogin } from '@/interfaces/user.interface';

export class PromotionController {
  async getAllPromotionsByQuery(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (req.query.code && !req.query.eventId) {
      const promotions = await prisma.promotion.findMany({
        where: {
          code: String(req.query.code),
        },
      });
      if (!promotions)
        return res.status(404).send({
          message: `Promotion with code ${req.query.code} not found.`,
        });
      return res.status(200).send({
        message: `Fetched all promotions with code ${req.query.code}`,
        data: promotions,
      });
    }

    if (req.query.eventId && !req.query.code) {
      const promotions = await prisma.promotion.findMany({
        where: {
          event_id: String(req.query.eventId),
        },
      });
      if (!promotions)
        return res.status(404).send({
          message: `Promotion with event_id ${req.query.eventId} not found.`,
        });
      return res.status(200).send({
        message: `Fetched all promotions with event_id ${req.query.eventId}`,
        data: promotions,
      });
    }

    if (req.query.code && req.query.eventId) {
      const promotion = await prisma.promotion.findFirst({
        where: {
          code: String(req.query.code),
          event_id: String(req.query.eventId),
        },
      });

      if (!promotion)
        return res.status(404).send({
          message: `Promotion with code ${req.query.code} and event_id ${req.query.eventId} not found.`,
        });

      return res.status(200).send({
        message: `Fetched unique promotion with code ${req.query.code} and event_id ${req.query.eventId}`,
        data: promotion,
      });
    }

    const promotions = await prisma.promotion.findMany();
    return res.status(200).send({
      message: `Fetched all promotions`,
      data: promotions,
    });
  }
  async getAllMyPromotions(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user as ILogin;
    try {
      const allMyPromotions = await prisma.promotion.findMany({
        where: {
          event: {
            organizer_id: id,
          },
        },
      });

      return res.status(200).send({
        message: `Fetched all promotions with organizer ID ${id}`,
        data: allMyPromotions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMyPromotionsByEventId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.user as ILogin;
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(401).send({
        message:
          "Couldn't fetch all promotion types by event ID without an event ID.",
      });
    }

    const myPromotions = await prisma.promotion.findFirst({
      where: { event_id: req.params.eventId },
      include: { event: true },
    });

    if (!myPromotions) {
      return res.status(404).send({
        message: `Couldn't find a promotion of event under ID ${eventId}`,
      });
    }

    if (myPromotions?.event.organizer_id !== id) {
      return res.status(403).send({
        message: `You do not have permission to get this promotion details`,
      });
    }

    const data = await prisma.promotion.findMany({
      where: { event_id: req.params.eventId },
    });

    if (!data.length) {
      return res.status(404).send({
        message: `You don't have any promotions under event id ${eventId}.`,
      });
    }

    res.status(201).send({
      message: `Successfully fetched all promotions under event_id ${eventId}.`,
      data: data,
    });
  }

  async getMyPromotionById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user as ILogin;
    try {
      if (!req.params.id || typeof String(req.params.id) !== 'string') {
        return res.status(401).send({
          message:
            'Fetch failed. ID is required to fetch a specific promotion.',
        });
      }

      const thisPromotion = await prisma.promotion.findUnique({
        where: { id: req.params.id },
        include: { event: true },
      });

      if (!thisPromotion) {
        return res.status(404).send({
          message: `Promotion with ID ${req.params.id} not found`,
        });
      }

      if (thisPromotion?.event.organizer_id !== id) {
        return res.status(403).send({
          message: `You do not have permission to get this promotion details`,
        });
      }

      const data = await prisma.promotion.findUnique({
        where: { id: req.params.id },
      });

      res.status(200).send({
        message: `Successfully fetched promotion with ID ${req.params.id}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const existingPromotion = await prisma.promotion.findFirst({
        where: {
          code: req.body.code,
          event_id: req.body.event_id,
        },
      });

      if (existingPromotion) {
        return res.status(401).send({
          message: `Failed to create promotion with code ${req.body.code} because another promotion with the same code already exist for this event`,
        });
      }

      const data = await prisma.promotion.create({
        data: {
          ...req.body,
          start_date: new Date(req.body.start_date),
          end_date: new Date(req.body.end_date),
        },
      });

      res.status(200).send({
        message: `Created promotion with code ${req.body.code} created.`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user as ILogin;

      if (!req.params.id || typeof String(req.params.id) !== 'string') {
        return res.status(401).send({
          message:
            'Update failed. ID is required to update a specific promotion.',
        });
      }

      const thisPromotion = await prisma.promotion.findUnique({
        where: { id: String(req.params.id) },
        include: { event: true },
      });

      if (!thisPromotion) {
        return res.status(404).send({
          message: `Promotion with ID ${req.params.id} not found`,
        });
      }

      if (thisPromotion?.event.organizer_id !== id) {
        return res.status(403).send({
          message: `You do not have permission to update this promotion`,
        });
      }

      const data = await prisma.promotion.update({
        data: {
          ...req.body,
          start_date: new Date(req.body.start_date),
          end_date: new Date(req.body.end_date),
        },
        where: { id: String(req.params.id) },
      });

      res.status(200).send({
        message: `Promotion with ID ${req.params.id} updated successfully`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePromotion(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user as ILogin;

    if (!req.params.id || typeof String(req.params.id) !== 'string') {
      return res.status(401).send({
        message:
          'Deletion failed. ID is required to delete a specifc promotion.',
      });
    }

    const thisPromotion = await prisma.promotion.findUnique({
      where: { id: String(req.params.id) },
      include: { event: true },
    });

    if (!thisPromotion) {
      return res.status(404).send({
        message: `Promotion with ID ${req.params.id} not found`,
      });
    }

    if (thisPromotion?.event.organizer_id !== id) {
      return res.status(403).send({
        message: `You do not have permission to delete this promotion`,
      });
    }

    const data = await prisma.promotion.delete({
      where: { id: req.params.id },
    });

    res.send({
      message: `promotion with ID ${req.params.id} has been deleted successfully.`,
      data: data,
    });
  }
}
