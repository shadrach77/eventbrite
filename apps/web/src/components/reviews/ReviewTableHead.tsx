'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import plusIcon from '@/media/icons/plus-icon.svg';
import Link from 'next/link';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';

function ReviewTableHead({ event_id }: { event_id: string }) {
  const { data: session, status } = useSession();
  const [eventTitle, setEventTitle] = useState('');
  useEffect(() => {
    async function getEventTitle() {
      try {
        const response = await api(
          `events/my-events/${event_id}`,
          'GET',
          {},
          session?.user.authentication_token,
        );
        setEventTitle(response.data.title);
      } catch (error) {
        console.log(error);
      }
    }
    getEventTitle();
  }, [event_id, session?.user.authentication_token]);

  return (
    <div className="flex flex-row gap-4 justify-between items-center px-4 py-2 w-full bg-blue-400">
      <div className="text-secondaryText sm:truncate mr-2 py-1 px-2">
        Reviews For {eventTitle}
      </div>
    </div>
  );
}

export default ReviewTableHead;
