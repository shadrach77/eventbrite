import Image from 'next/image';
import React from 'react';
import plusIcon from '@/media/icons/plus-icon.svg';
import Link from 'next/link';

function TransactionTableHead() {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 w-full bg-blue-400">
      <div className="text-secondaryText">
        Pending Transactions (to evaluate)
      </div>
      <Link
        href={'/dashboard'}
        className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600"
      >
        <div>...</div>
        <Image src={plusIcon} alt="plus icon" className="h-5 w-5"></Image>
      </Link>
    </div>
  );
}

export default TransactionTableHead;
