'use client';
import EventCard from '@/components/home/EventCard';
import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { IEvent } from '@/types/event.interface';
import { api } from '@/helpers/api';
import ScreenCenter from '@/components/global/ScreenCenter';

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
    <ScreenCenter>
      <div className="flex flex-col md:flex-row md:justify-center gap-8 mb-36 px-4 flex-wrap mt-8">
        {filteredEvents.length ? (
          filteredEvents.map((event: IEvent) => {
            return <EventCard {...event} key={event.id} />;
          })
        ) : (
          <div>{`'${query}' is not found. Try a different keyword.`}</div>
        )}
      </div>
    </ScreenCenter>
  );
}

export default page;
