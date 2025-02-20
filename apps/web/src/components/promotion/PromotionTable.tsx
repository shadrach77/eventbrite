'use client';
import React, { useEffect, useState } from 'react';
import TicketTableHead from './PromotionTableHead';

import Image from 'next/image';
import TicketTableBody from './PromotionTableBody';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { IEvent, IPromotionType } from '@/types/event.interface';
import PromotionTableHead from './PromotionTableHead';
import PromotionTableBody from './PromotionTableBody';

function PromotionTable({ event_id }: { event_id: string }) {
  const { data: session } = useSession();
  const [myPromotions, setMyPromotions] = useState<IPromotionType[]>([]);

  useEffect(() => {
    async function getPromotions() {
      try {
        const response = await api(
          `promotions/my-promotions/byEventId/${event_id}`,
          'GET',
          {},
          session?.user.authentication_token,
        );
        setMyPromotions(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getPromotions();
  }, [session, event_id]);
  //I added event_id just to eliminate a typescript warning.
  return (
    <div className="w-3/4">
      <PromotionTableHead event_id={event_id} />
      {myPromotions.map((promotion) => {
        return (
          <PromotionTableBody
            key={promotion.id}
            {...promotion}
            setMyPromotions={setMyPromotions}
          />
        );
      })}
    </div>
  );
}

export default PromotionTable;
