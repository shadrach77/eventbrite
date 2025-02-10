'use client';

import React from 'react';
import gearIcon from '@/media/icons/gear-icon.svg';
import Image from 'next/image';
import { IEvent } from '@/types/event.interface';
import Link from 'next/link';
import { api } from '@/helpers/api';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';

function EventTableBody({
  title,
  id,
  picture,
  setMyEvents,
}: IEvent & { setMyEvents: React.Dispatch<React.SetStateAction<IEvent[]>> }) {
  const { data: session } = useSession();
  const onDelete = async () => {
    async function deletePicture(link: string) {
      const response = await fetch(
        'http://localhost:8000/api/events/my-event-picture',
        {
          method: 'DELETE',
          body: JSON.stringify({
            link: link,
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

      toast.success('Picture deleted successfully.');
      setMyEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== id),
      );
    }

    async function deleteEvent() {
      console.log('token =>', session?.user.authentication_token);
      const response = await fetch(
        'http://localhost:8000/api/events/my-events',
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
      setMyEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== id),
      );
    }

    try {
      if (picture) {
        await deletePicture(picture);
      }

      await deleteEvent();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this event? This action is not reversible',
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
          href={`/dashboard/events/${id}/edit`}
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
        <Link
          href={`/dashboard/events/${id}`}
          className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600"
        >
          <div>Configure</div>
          <Image src={gearIcon} alt="gear icon" className="h-4 w-4"></Image>
        </Link>
      </div>
      <Toaster richColors></Toaster>
    </div>
  );
}

export default EventTableBody;
