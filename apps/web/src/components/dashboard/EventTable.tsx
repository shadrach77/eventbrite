import React from 'react';
import EventsTable from './EventTableHead';
import gearIcon from '@/media/icons/gear-icon.svg';
import Image from 'next/image';

function EventTable() {
  return (
    <div className="w-3/4">
      <EventsTable />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 w-full bg-blue-200">
        <div>Hawk Tuah Podcast</div>
        <div className="flex gap-2">
          <div className="py-1 px-2 rounded-sm text-white bg-secondaryText">
            Edit
          </div>
          <div className="py-1 px-2 rounded-sm text-white bg-red-600">
            Delete
          </div>
          <div className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600">
            <div>Configure</div>
            <Image src={gearIcon} alt="gear icon" className="h-4 w-4"></Image>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTable;
