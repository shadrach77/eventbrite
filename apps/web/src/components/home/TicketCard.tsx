'use client';
import { ITicketDetail } from '@/app/events/[event_id]/page';
import { ITicketType } from '@/types/event.interface';
import React, { useState } from 'react';
import dayjs from 'dayjs';

function TicketCard({
  id,
  title,
  price,
  available_seats,
  start_date,
  end_date,
  setCheckoutTotal,
  setCheckoutTickets,
}: ITicketType & {
  setCheckoutTotal: React.Dispatch<React.SetStateAction<number>>;
  setCheckoutTickets: React.Dispatch<React.SetStateAction<ITicketDetail[]>>;
}) {
  const [ticketAmount, setTicketAmount] = useState(0);

  function addOneTicket() {
    if (ticketAmount >= available_seats) return;

    setTicketAmount((prevAmount) => prevAmount + 1);
    setCheckoutTotal((prevAmount) => prevAmount + price);
    setCheckoutTickets((prev) => {
      const array = [...prev];
      const existingIndex = array.findIndex(
        (ticket) => ticket.ticket_id === id,
      );

      if (existingIndex >= 0) {
        array[existingIndex].amount += 1;
      } else {
        array.push({ ticket_id: id, amount: 1 });
      }
      return array;
    });
  }

  function reduceOneTicket() {
    if (ticketAmount === 0) return;

    setTicketAmount((prevAmount) => prevAmount - 1);
    setCheckoutTotal((prevAmount) => prevAmount - price);
    setCheckoutTickets((prev) => {
      const array = [...prev];
      const existingIndex = array.findIndex(
        (ticket) => ticket.ticket_id === id,
      );

      if (existingIndex >= 0) {
        array[existingIndex].amount -= 1;
        if (array[existingIndex].amount <= 0) array.splice(existingIndex, 1);
      }
      return array;
    });
  }

  return (
    <div className="flex justify-between items-center max-w-[550px] max-h-24 p-4 border-2 border-secondaryBackground">
      <div>
        <div className="mb-4 text-sm">{title}</div>
        <div className="text-sm">{price}</div>
      </div>
      <div>
        <div className="flex justify-center items-baseline gap-2 bg-green-200">
          <button
            className="bg-blueAccent h-8 w-8 disabled:opacity-50"
            disabled={ticketAmount === 0}
            onClick={reduceOneTicket}
          >
            -
          </button>

          <div className="mb-4 text-lg min-w-8 text-center bg-blue-100">
            {ticketAmount}
          </div>
          <button
            disabled={ticketAmount === available_seats}
            className="bg-blueAccent h-8 w-8 disabled:opacity-50"
            onClick={addOneTicket}
          >
            +
          </button>
        </div>

        <div className="text-xs">
          {dayjs(start_date).format('DD MMM, YYYY')} -{' '}
          {dayjs(end_date).format('DD MMM, YYYY')}
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
