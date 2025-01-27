import ScreenCenter from '@/components/global/ScreenCenter';
import React from 'react';
import EventTable from '@/components/dashboard/EventTable';

function page() {
  return (
    <ScreenCenter>
      <div className="flex flex-col items-center mt-24 w-screen">
        <EventTable />
      </div>
    </ScreenCenter>
  );
}

export default page;
