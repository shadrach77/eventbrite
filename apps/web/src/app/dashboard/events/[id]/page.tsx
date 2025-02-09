import EventTable from '@/components/dashboard/EventTable';
import ScreenCenter from '@/components/global/ScreenCenter';
import TicketTable from '@/components/tickets-organizer/TicketTable';

type Props = {
  params: {
    id: string;
  };
};

function page({ params: { id } }: Props) {
  return (
    <div>
      <ScreenCenter>
        <div className="flex flex-col items-center mt-24 w-screen">
          <TicketTable />
        </div>
      </ScreenCenter>
    </div>
  );
}

export default page;
