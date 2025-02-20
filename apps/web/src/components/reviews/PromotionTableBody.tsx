'use client';

import React from 'react';
import { IEvent, IPromotionType, IReviewType } from '@/types/event.interface';
import Link from 'next/link';

function ReviewTableBody({
  id,
  transaction_id,
  rating,
  event_id,
  description,
}: IReviewType) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 w-full bg-blue-200">
      <div className="sm:truncate sm:flex-1">
        Transaction ID: {transaction_id}
      </div>

      <div className="sm:truncate sm:flex-1">
        {' '}
        {Array.from({ length: rating }, () => (
          <span>⭐️</span>
        ))}
      </div>

      <div className="flex gap-2 whitespace-nowrap">
        <Link
          href={`/dashboard/events/${event_id}/reviews/${id}`}
          className="py-1 px-2 rounded-sm text-white bg-secondaryText"
        >
          View Review
        </Link>
      </div>
    </div>
  );
}

export default ReviewTableBody;
