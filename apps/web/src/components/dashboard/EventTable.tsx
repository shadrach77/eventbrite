'use client';
import React, { useEffect, useState } from 'react';
import EventTableHead from './EventTableHead';

import Image from 'next/image';
import EventTableBody from './EventTableBody';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { IEvent } from '@/types/event.interface';

function EventTable() {
  const { data: session } = useSession();
  const [myEvents, setMyEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    async function getEvents() {
      try {
        const response = await api(
          'events/my-events',
          'GET',
          {},
          session?.user.authentication_token,
        );
        setMyEvents(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getEvents();
  }, [session]);
  return (
    <div className="w-3/4">
      <EventTableHead />
      {myEvents.map((event) => {
        return (
          <EventTableBody key={event.id} {...event} setMyEvents={setMyEvents} />
        );
      })}
    </div>
  );
}

export default EventTable;
