import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';

export class LocationController {
  async getAllLocations(req: Request, res: Response) {
    const data = await prisma.location.findMany();

    return res.status(201).send({
      message: `Successfully fecthed all locations`,
      data: data,
    });
  }

  async createLocation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.label || typeof req.body.label !== 'string') {
        return res.status(400).send({
          message: `Failed to create location due to incorrect body`,
        });
      }

      const existingData = await prisma.location.findFirst({
        where: { label: req.body.label },
      });

      if (existingData) {
        return res.status(400).send({
          message: `Failed to create location with label ${req.body.label} because another location with the same label exists`,
        });
      }

      const data = await prisma.location.create({
        data: req.body,
      });

      return res.status(200).send({
        message: `Succesfully created location with label ${req.body.label}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
}

console.log('Hello');
