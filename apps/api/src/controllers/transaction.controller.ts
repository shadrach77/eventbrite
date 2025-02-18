import { Request, Response } from 'express';
import prisma from '@/prisma';
import { addHours } from 'date-fns';

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

      let pointsUsed = points_used ?? 0;

      if (use_points_boolean === true) {
        pointsUsed = req.user.points ?? 0;
      }

      if (points_used) {
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
}
