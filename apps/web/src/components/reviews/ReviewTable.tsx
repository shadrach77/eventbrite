'use client';
import React, { useEffect, useState } from 'react';
import TicketTableHead from './ReviewTableHead';
import Image from 'next/image';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { IReviewType } from '@/types/event.interface';
import PromotionTableHead from './ReviewTableHead';
import ReviewTableHead from './ReviewTableHead';
import ReviewTableBody from './PromotionTableBody';

function ReviewTable({ event_id }: { event_id: string }) {
  const { data: session } = useSession();
  const [allReviews, setAllReviews] = useState<IReviewType[]>([]);

  useEffect(() => {
    async function getAllReviews() {
      try {
        const response = await api(
          `reviews/byEventId/${event_id}`,
          'GET',
          {},
          session?.user.authentication_token,
        );
        setAllReviews(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllReviews();
  }, [session, event_id]);

  return (
    <div className="w-3/4">
      <ReviewTableHead event_id={event_id} />
      {allReviews.map((review) => {
        return <ReviewTableBody key={review.id} {...review} />;
      })}
    </div>
  );
}

export default ReviewTable;
