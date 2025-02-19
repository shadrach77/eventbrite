import { Request, Response } from 'express';
import prisma from '@/prisma';
import { addDays, addHours } from 'date-fns';
import { cloudinaryUpload } from '@/helpers/cloudinary';

interface ITransactionTicket {
  id?: string;
  transaction_id?: string;
  ticket_id: string;
  quantity: number;
}

interface ITicketDetails {
  id: string;
  event_id: string;
  title: string;
  price: number;
  available_seats: number;
  start_date: any;
  end_date: any;
  created_at: any;
  updated_at: any;
}

export class TransactionController {
  async createTransaction(req: Request, res: Response) {
    try {
      const {
        points_used,
        promotion_id,
        tickets,
        event_id,
        use_points_boolean,
      } = req.body;

      if (!req?.user?.id) {
        return res.send({
          message: `Insufficient permission. req.user.id is missing on JWT Token`,
        });
      }

      const ticketIds = tickets.map((ticket: ITransactionTicket) => {
        return ticket.ticket_id;
      });

      const ticketDetails: ITicketDetails[] = await prisma.ticketType.findMany({
        where: {
          id: {
            in: ticketIds,
          },
        },
      });

      let calculatedGrandTotal = tickets.reduce(
        (total: number, ticket: ITransactionTicket) => {
          const ticketDetail = ticketDetails.find(
            (detail) => detail.id === ticket.ticket_id,
          );
          if (!ticketDetail)
            throw new Error(`Ticket with ID ${ticket.ticket_id} not found`);
          return total + ticket.quantity * ticketDetail.price;
        },
        0,
      );

      if (promotion_id) {
        const promotionDetails = await prisma.promotion.findUnique({
          where: {
            id: promotion_id,
            event_id: event_id,
          },
        });

        if (!promotionDetails) {
          return res.status(404).send({
            message: `Your promotion_id ${promotion_id} is either not applicable for this event or not found.`,
          });
        }

        calculatedGrandTotal = calculatedGrandTotal - promotionDetails?.amount;
      }

      let pointsUsed = 0;

      if (use_points_boolean === true) {
        pointsUsed = req.user.points ?? 0;
      }

      if (use_points_boolean === true) {
        calculatedGrandTotal = calculatedGrandTotal - pointsUsed;
      }

      const transaction = await prisma.transaction.create({
        data: {
          event_id: event_id,
          customer_id: String(req.user?.id),
          points_used: pointsUsed,
          promotion_id: promotion_id,
          status: 'PENDING_PAYMENT',
          grand_total: calculatedGrandTotal,
          payment_proof_deadline: addHours(new Date(), 2),
        },
      });

      const transactionTicket = await Promise.all(
        tickets.map(async (ticket: ITransactionTicket) => {
          return await prisma.transactionTicket.create({
            data: {
              transaction_id: transaction.id,
              ticket_id: ticket.ticket_id,
              quantity: ticket.quantity,
            },
          });
        }),
      );

      res.send({
        message: `Successfully created transaction and transactionTicket`,
        data: {
          transaction: transaction,
          transactionTicket: transactionTicket,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async uploadTransactionPicture(req: Request, res: Response) {
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

  async getAllMyTransactions(req: Request, res: Response) {
    try {
      if (!req?.user?.id) {
        return res.status(400).send({
          message: `Failed to get all my transactions because there's no req.user.id in JWT.`,
        });
      }

      const allMyTransactions = await prisma.transaction.findMany({
        where: {
          customer_id: req.user?.id,
        },
      });

      res.status(200).send({
        message: `Successfully fetched all transactions belonging to customer with User ID ${req.user.id}`,
        data: allMyTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getTransactionById(req: Request, res: Response) {
    try {
      const { transaction_id } = req.params;
      if (!transaction_id) {
        return res.status(400).send({
          message: `Failed to fetch a specific transaction because there's no transaction_id in params.`,
        });
      }

      const transaction = await prisma.transaction.findUnique({
        where: {
          id: transaction_id,
        },
      });

      if (!transaction) {
        return res.status(404).send({
          message: `Failed to fetch transaction with transaction_id ${transaction_id} because it doesn't exist.`,
        });
      }

      res.status(200).send({
        message: `Successfully fetched transaction ID ${transaction_id}`,
        data: transaction,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateMyTransaction(req: Request, res: Response) {
    const { use_points_boolean, promotion_code, payment_proof, event_id } =
      req.body;
    const { transaction_id } = req.params;

    const transactionDetails = await prisma.transaction.findUnique({
      where: {
        id: transaction_id,
        customer_id: req.user?.id,
      },
    });

    if (!transactionDetails) {
      return res.status(404).send({
        message: `Couldn't update transaction with transaction_id ${transaction_id} because it either doesn't exist or doesn't belong to you`,
      });
    }

    let calculatedGrandTotal = transactionDetails?.grand_total;
    let updatedPromotionId = transactionDetails.promotion_id;

    if (promotion_code && event_id) {
      const promotionDetails = await prisma.promotion.findFirst({
        where: {
          code: promotion_code,
          event_id: event_id,
        },
      });

      if (!promotionDetails) {
        return res.status(404).send({
          message: `Your promotion_code ${promotion_code} is either not applicable for this event or not found.`,
        });
      }

      calculatedGrandTotal = calculatedGrandTotal - promotionDetails?.amount;
      updatedPromotionId = promotionDetails.id;
    }

    if (!payment_proof) {
      return res.status(404).send({
        message: `Couldn't complete transaction without payment_proof`,
      });
    }

    let updatedPointsUsed = 0;

    if (use_points_boolean) {
      updatedPointsUsed = Number(req.user?.points);
      calculatedGrandTotal = calculatedGrandTotal - updatedPointsUsed;
    }

    const data = await prisma.transaction.update({
      data: {
        promotion_id: updatedPromotionId,
        payment_proof: payment_proof,
        points_used: updatedPointsUsed,
        status: 'PENDING_ADMIN_CONFIRMATION',
        acceptance_deadline: addDays(new Date(), 3),
        grand_total: calculatedGrandTotal >= 0 ? calculatedGrandTotal : 0,
      },
      where: { id: req.params.transaction_id },
    });
  }

  async cancelMyTransaction(req: Request, res: Response) {
    const { transaction_id } = req.params;

    if (!transaction_id) {
      res.status(403).send({
        message: `Couldn't cancel transaction without 'my_transaction' as params.`,
      });
    }

    const canceledTransaction = await prisma.transaction.update({
      data: {
        status: 'CANCELED',
      },
      where: { id: transaction_id },
    });

    return res.status(201).send({
      message: `Successfully cancel transaction with transaction_id ${transaction_id}`,
      data: canceledTransaction,
    });
  }
}
