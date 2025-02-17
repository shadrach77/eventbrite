'use client';
import { api } from '@/helpers/api';
import { IEvent } from '@/types/event.interface';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import defaultEventPicture from '@/media/default/eventbrite_default_event_picture.jpg';
import ScreenCenter from '@/components/global/ScreenCenter';
import dayjs from 'dayjs';
import TicketCard from '@/components/home/TicketCard';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    event_id: string;
  };
};

export interface ITicketDetail {
  ticket_id: string;
  amount: number;
}

function Page({ params: { event_id } }: Props) {
  const [event, setEvent] = useState<IEvent>();
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutTickets, setCheckoutTickets] = useState<ITicketDetail[] | []>(
    [],
  );
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function getEvent() {
      const eventResponse = await api(`events/my-events/${event_id}`, 'GET');
      const eventDetails: IEvent = await eventResponse.data;
      setEvent(eventDetails);
    }
    getEvent();
  }, [event_id]);

  function checkout() {
    if (!session?.user) {
      router.push('/sign-in');
    } else {
      //todo: implement adding to transaction
    }
  }

  return (
    <>
      <div>
        <Image
          src={event?.picture ? event.picture : defaultEventPicture}
          alt={`${event?.title} event banner`}
          className="w-screen max-w-[1200px] max-h-96 object-cover"
        />
        <ScreenCenter>
          <div className="w-full p-8 relative lg:flex lg:justify-between">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col w-full">
                <div className="w-full">
                  {dayjs(event?.start_date).format("dddd, MMMM DD 'YY")} -{' '}
                  {dayjs(event?.end_date).format("dddd, MMMM DD 'YY")}
                </div>
                <div className="text-6xl font-bold w-full">{event?.title}</div>
              </div>
              <div className="flex flex-col w-full">
                <div className="font-bold text-xl">Start Date and End Date</div>
                <div className="text-sm">
                  Start Date:{' '}
                  {dayjs(event?.start_date).format('dddd, MMMM DD, YYYY')}
                </div>
                <div className="text-sm">
                  End date:{' '}
                  {dayjs(event?.end_date).format('dddd, MMMM DD, YYYY')}
                </div>
              </div>
              <div className="flex flex-col w-full">
                <div className="font-bold text-xl">Location</div>
                <div className="text-sm">
                  {event?.location?.label
                    ? event.location.label.charAt(0).toUpperCase() +
                      event.location.label.slice(1).toLowerCase()
                    : 'Location not available'}
                </div>
              </div>
              <div className="flex flex-col w-full">
                <div className="font-bold text-xl">About This Event</div>
                <div className="text-sm">{event?.description}</div>
              </div>
              <div className="flex flex-col w-full">
                <div className="font-bold text-xl" id="tickets">
                  Tickets
                </div>
                {event?.ticket_types.map((ticket) => {
                  return (
                    <TicketCard
                      key={ticket.id}
                      {...ticket}
                      setCheckoutTotal={setCheckoutTotal}
                      setCheckoutTickets={setCheckoutTickets}
                    ></TicketCard>
                  );
                })}
              </div>
            </div>
            <div className="hidden lg:flex items-center max-w-96 min-h-20 h-full w-full p-4 border-4 rounded-xl border-secondaryBackground">
              <button
                className={
                  checkoutTickets.length
                    ? 'bg-primaryOrange w-full h-10 p-4 text-sm whitespace-nowrap flex items-center justify-center'
                    : 'hidden'
                }
                onClick={checkout}
              >
                {`Check out For Rp.${checkoutTotal.toLocaleString()}`}
              </button>
              <Link
                href={'#tickets'}
                className={
                  checkoutTickets.length
                    ? 'hidden'
                    : 'bg-primaryOrange w-full h-10 p-4 text-sm whitespace-nowrap flex items-center justify-center'
                }
              >
                {'Select Tickets'}
              </Link>
            </div>
          </div>
        </ScreenCenter>
      </div>
      <div className="lg:hidden flex p-4 fixed bottom-0 left-0 right-0 border-t-2 border-2 border-secondaryBackground">
        <button className="bg-primaryOrange w-full h-10 p-4 text-sm flex justify-center items-center">
          Buy Tickets
        </button>
      </div>
    </>
  );
}

export default Page;
