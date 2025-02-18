import ScreenCenter from '@/components/global/ScreenCenter';
import React from 'react';
import MyTicketTable from '@/components/my-tickets/MyTicketTable';

function page() {
  return (
    <ScreenCenter>
      <div className="flex flex-col items-center mt-24 w-screen">
        <MyTicketTable />
      </div>
    </ScreenCenter>
  );
}

export default page;
