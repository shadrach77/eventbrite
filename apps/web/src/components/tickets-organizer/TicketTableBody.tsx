'use client';

import React from 'react';
import gearIcon from '@/media/icons/gear-icon.svg';
import Image from 'next/image';
import { IEvent, ITicketType } from '@/types/event.interface';
import Link from 'next/link';
import { api } from '@/helpers/api';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';

function TicketTableBody({
  id,
  title,
  price,
  available_seats,
  setMyTickets,
}: ITicketType & {
  setMyTickets: React.Dispatch<React.SetStateAction<ITicketType[]>>;
}) {
  const { data: session } = useSession();
  const onDelete = async () => {
    async function deleteTicketType() {
      console.log('token =>', session?.user.authentication_token);
      const response = await fetch(
        'http://localhost:8000/api/tickets/my-events',
        {
          method: 'DELETE',
          body: JSON.stringify({
            id: id,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.authentication_token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Something went wrong!');
      }

      toast.success('Event deleted successfully.');
      setMyTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== id),
      );
    }

    try {
      await deleteTicketType();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this ticket type? This action is not reversible',
      )
    ) {
      onDelete();
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 w-full bg-blue-200">
      <div className="sm:truncate sm:flex-1">{title}</div>

      <div className="flex gap-2 whitespace-nowrap">
        <Link
          href={`/dashboard/events//tickets/${id}/edit`}
          className="py-1 px-2 rounded-sm text-white bg-secondaryText"
        >
          Edit
        </Link>
        <button
          onClick={() => {
            handleDelete();
          }}
          className="py-1 px-2 rounded-sm text-white bg-red-600"
        >
          Delete
        </button>
      </div>
      <Toaster richColors></Toaster>
    </div>
  );
}

export default TicketTableBody;
