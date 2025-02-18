import Image from 'next/image';
import React from 'react';
import browseIcon from '@/media/icons/browse-icon.svg';
import Link from 'next/link';

function MyTicketTableHead() {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 w-full bg-blue-400">
      <div className="text-secondaryText">My Tickets</div>
      <Link
        href={'/'}
        className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600"
      >
        <div>Browse For Tickets</div>
        <Image src={browseIcon} alt="plus icon" className="h-5 w-5"></Image>
      </Link>
    </div>
  );
}

export default MyTicketTableHead;
