import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';

export class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    const data = await prisma.category.findMany();

    return res.status(201).send({
      message: `Successfully fecthed all categories`,
      data: data,
    });
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.label || typeof req.body.label !== 'string') {
        return res.status(400).send({
          message: `Failed to create category due to incorrect body`,
        });
      }

      const existingData = await prisma.category.findFirst({
        where: { label: req.body.label },
      });

      if (existingData) {
        return res.status(400).send({
          message: `Failed to create category with label ${req.body.label} because another category with the same label exists`,
        });
      }

      const data = await prisma.category.create({
        data: req.body,
      });

      return res.status(200).send({
        message: `Succesfully created category with label ${req.body.label}`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
}

console.log('Hello');
