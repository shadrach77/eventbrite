import EventTable from '@/components/dashboard/EventTable';
import ScreenCenter from '@/components/global/ScreenCenter';
import PromotionTable from '@/components/promotion/PromotionTable';
import ReviewTable from '@/components/reviews/ReviewTable';
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
        <div className="flex flex-col gap-8 items-center mt-24 w-screen">
          <TicketTable event_id={id} />
          <PromotionTable event_id={id} />
          <ReviewTable event_id={id} />
        </div>
      </ScreenCenter>
    </div>
  );
}

export default page;
