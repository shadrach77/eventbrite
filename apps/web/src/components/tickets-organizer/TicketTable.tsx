'use client';
import React, { useEffect, useState } from 'react';
import TicketTableHead from './TicketTableHead';

import Image from 'next/image';
import TicketTableBody from './TicketTableBody';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { IEvent, ITicketType } from '@/types/event.interface';

function TicketTable() {
  const { data: session } = useSession();
  const [myTickets, setMyTickets] = useState<ITicketType[]>([]);

  useEffect(() => {
    async function getTickets() {
      try {
        const response = await api(
          'tickets/my-tickets',
          'GET',
          {},
          session?.user.authentication_token,
        );
        setMyTickets(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getTickets();
  }, [session]);
  return (
    <div className="w-3/4">
      <TicketTableHead />
      {myTickets.map((ticket) => {
        return (
          <TicketTableBody
            key={ticket.id}
            {...ticket}
            setMyTickets={setMyTickets}
          />
        );
      })}
    </div>
  );
}

export default TicketTable;
