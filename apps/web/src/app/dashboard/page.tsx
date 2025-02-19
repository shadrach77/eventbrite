import ScreenCenter from '@/components/global/ScreenCenter';
import React from 'react';
import EventTable from '@/components/dashboard/EventTable';
import TransactionTable from '@/components/dashboard/TransactionTable';

function page() {
  return (
    <ScreenCenter>
      <div className="flex flex-col items-center mt-24 w-screen gap-8">
        <EventTable />
        <TransactionTable />
      </div>
    </ScreenCenter>
  );
}

export default page;
