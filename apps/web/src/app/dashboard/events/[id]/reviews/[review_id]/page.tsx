'use client';
import ScreenCenter from '@/components/global/ScreenCenter';
import { api } from '@/helpers/api';
import { IReviewType } from '@/types/event.interface';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function page({ params: { review_id } }: { params: { review_id: string } }) {
  const [reviewDetails, setReviewDetails] = useState<IReviewType>();
  useEffect(() => {
    async function getReview() {
      const review = await api(`reviews/${review_id}`, 'GET');
      setReviewDetails(review.data);
    }

    getReview();
  }, [review_id]);
  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-screen-md flex flex-col gap-6 m-12">
        <div className="text-3xl font-bold">Review Details</div>
        <div className="flex justify-between w-full rounded-[12px] border border-[#D4D7E3] p-3">
          <div>{'Transaction ID:'}</div>
          <div>{reviewDetails?.transaction_id}</div>
        </div>
        <div className="flex justify-between w-full rounded-[12px] border border-[#D4D7E3] p-3">
          <div>{'Rating:'}</div>
          <div>
            {' '}
            {Array.from({ length: Number(reviewDetails?.rating) }, () => (
              <span>⭐️</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full rounded-[12px] border border-[#D4D7E3] p-3">
          <div>{'Description:'}</div>
          <div>{reviewDetails?.description}</div>
        </div>
        <Link
          href={`/dashboard/events/${reviewDetails?.event_id}`}
          className="text-blueAccent underline"
        >
          Back to Event Details
        </Link>
      </div>
    </div>
  );
}

export default page;
