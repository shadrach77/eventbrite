import Image from 'next/image';
import React from 'react';
import plusIcon from '@/media/icons/plus-icon.svg';
import Link from 'next/link';

function TransactionTableHead() {
  return (
    <div className="flex flex-row gap-4 justify-between items-center px-4 py-2 w-full bg-blue-400">
      <div className="text-secondaryText sm:truncate mr-2 py-1 px-2">
        Pending transactions
      </div>
    </div>
  );
}

export default TransactionTableHead;
