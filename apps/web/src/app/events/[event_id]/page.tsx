'use client';
import { api } from '@/helpers/api';
import { IEvent } from '@/types/event.interface';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import defaultEventPicture from '@/media/default/eventbrite_default_event_picture.jpg';
import ScreenCenter from '@/components/global/ScreenCenter';
import dayjs from 'dayjs';

type Props = {
  params: {
    event_id: string;
  };
};

function Page({ params: { event_id } }: Props) {
  const [event, setEvent] = useState<IEvent>();
  useEffect(() => {
    async function getEvent() {
      const event = await api(`events/my-events/${event_id}`, 'GET');
      const eventDetails: IEvent = await event.data;
      setEvent(eventDetails);
    }

    getEvent();
  }, [event_id]);

  return (
    <div>
      <Image
        src={event?.picture ? event.picture : defaultEventPicture}
        alt={`${event?.title} event banner`}
        className="w-screen max-w-[1200px] max-h-96 object-cover"
      />
      <ScreenCenter>
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex-col w-full bg-green-200 lg:w-2/3">
            <div className="flex flex-col">
              <div className="w-full text-md">
                {dayjs(event?.start_date).format('dddd, MMMM DD YYYY')} to{' '}
                {dayjs(event?.end_date).format('dddd, MMMM DD YYYY')}
              </div>
              <div className="w-full text-6xl font-bold bg-blue-300">
                {event?.title}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center w-full lg:w-1/3 bg-orange-200">
            <button className=" py-2 px-4 bg-orange-400 w-full lg:w-80 h-10 text-sm text-white">
              Select Tickets
            </button>
          </div>
        </div>
      </ScreenCenter>
    </div>
  );
}

export default Page;
