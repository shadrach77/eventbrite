'use client';
import EventCard from '@/components/home/EventCard';
import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { IEvent } from '@/types/event.interface';
import { api } from '@/helpers/api';

function page() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    async function getEvents() {
      const eventResponse = await api(`events?q=${query}`, 'GET');
      const eventDetails: IEvent[] = await eventResponse.data;
      setFilteredEvents(eventDetails);
    }
    getEvents();
  }, [query]);

  return (
    <div>
      {filteredEvents.length ? (
        filteredEvents.map((event: IEvent) => {
          return <EventCard {...event} key={event.id} />;
        })
      ) : (
        <div>{`"${query}" is not found. Try a different keyword.`}</div>
      )}
    </div>
  );
}

export default page;
