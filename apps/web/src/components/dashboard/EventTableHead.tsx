import Image from 'next/image';
import React from 'react';
import plusIcon from '@/media/icons/plus-icon.svg';
import Link from 'next/link';

function EventTableHead() {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 w-full bg-blue-400">
      <div className="text-secondaryText">Events</div>
      <Link
        href={'/dashboard/create/event'}
        className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600"
      >
        <div>Add Event</div>
        <Image src={plusIcon} alt="plus icon" className="h-5 w-5"></Image>
      </Link>
    </div>
  );
}

export default EventTableHead;
