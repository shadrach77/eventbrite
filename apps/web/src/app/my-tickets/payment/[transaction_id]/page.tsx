'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import * as Yup from 'yup';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  IPromotionType,
  ITicketType,
  ITransaction,
  ITransactionAndTransactionTicket,
  ITransactionTicket,
} from '@/types/event.interface';

type Props = {
  params: {
    transaction_id: string;
  };
};

const validationSchema = Yup.object({
  use_points_boolean: Yup.boolean(),
  promotion_code: Yup.string().optional(),
  picture: Yup.string().optional(),
});

export default function Page({ params: { transaction_id } }: Props) {
  const { data: session, update } = useSession();
  console.log('User points:', session?.user.points);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [disabledPromoFields, setDisabledPromoFields] = useState(false);
  const [event, setEvent] = useState<ITransactionAndTransactionTicket>();
  const [updatedGrandTotalBeforePoints, setUpdatedGrandTotalBeforePoints] =
    useState(0);
  const [updatedGrandTotal, setUpdatedGrandTotal] = useState(0);
  const [ticketTypeDetails, setTicketTypeDetails] = useState<ITicketType[]>([]);

  useEffect(() => {
    async function getEvent() {
      try {
        const response = await api(`transactions/${transaction_id}`, 'GET');
        const event = response.data as ITransactionAndTransactionTicket;
        setEvent(event);
        setUpdatedGrandTotalBeforePoints(event.grand_total);
      } catch (error) {
        toast.error('Failed to fetch event ID.');
        console.error(error);
      }
    }
    getEvent();
  }, [transaction_id]);

  useEffect(() => {
    console.log(
      'Updated Grand Total Before Points:',
      updatedGrandTotalBeforePoints,
    );
  }, [updatedGrandTotalBeforePoints]);

  async function applyPromotionCode() {
    console.log(
      'Applying promo:',
      formik.values.promotion_code,
      'Event ID:',
      event?.event_id,
    );
    if (!event?.event_id) {
      toast.error('Please try again');
      return;
    }

    if (!formik.values.promotion_code) {
      toast.success('Promo successfully removed');
      setUpdatedGrandTotalBeforePoints(event.grand_total);
      return;
    }

    setDisabledPromoFields(true);

    try {
      const response = await api(
        `promotions?code=${formik.values.promotion_code}&eventId=${event.event_id}`,
        'GET',
      );

      const promotionDetails = response.data as IPromotionType;

      if (!promotionDetails || !promotionDetails.amount) {
        toast.error('Invalid promotion code.');
        setDisabledPromoFields(false);
        return;
      }

      if (new Date() > new Date(promotionDetails.end_date)) {
        toast.error('Expired promotion code.');
        setDisabledPromoFields(false);
        return;
      }

      if (new Date() < new Date(promotionDetails.start_date)) {
        toast.error('Promotion has not started.');
        setDisabledPromoFields(false);
        return;
      }

      if (event.grand_total - promotionDetails.amount >= 0) {
        setUpdatedGrandTotalBeforePoints(
          event.grand_total - promotionDetails.amount,
        );
      } else {
        setUpdatedGrandTotalBeforePoints(0);
      }

      toast.success(`Promo applied! Discount: ${promotionDetails.amount}`);
      formik.setFieldValue(
        'promotion_code',
        formik.values.promotion_code,
        false,
      );
      setDisabledPromoFields(false);
    } catch (error) {
      toast.error('Failed to apply promotion code. Please try again.');
      setDisabledPromoFields(false);
      setUpdatedGrandTotalBeforePoints(event.grand_total);
      console.error(error);
    }
  }

  const formik = useFormik({
    initialValues: {
      use_points_boolean: true,
      promotion_code: '',
      picture: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!event?.event_id) {
        toast.error('Event ID is missing. Please wait or refresh the page.');
        return;
      }

      const uploadTransactionPicture = async (): Promise<string | void> => {
        if (!values.picture) return;

        const formData = new FormData();

        if (values.picture) {
          formData.append('picture', values.picture);
        }
        try {
          const response: any = await fetch(
            'http://localhost:8000/api/transactions/my-transactions/picture',
            {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${session?.user.authentication_token}`,
              },
            },
          );

          const data = await response.json();

          if (response.ok) {
            toast.success(data.message || 'Picture successfully uploaded!');
            return data.data;
          } else {
            toast.error(data.message || 'Something went wrong!');
            return;
          }
        } catch (error) {
          console.error(error);
          toast.error('Network error. Please try again later.');
          return;
        }
      };

      const updateTransaction = async (pictureUrl: string | void) => {
        try {
          const response: any = await fetch(
            `http://localhost:8000/api/transactions/my-transactions/${transaction_id}`,
            {
              method: 'PATCH',
              body: JSON.stringify({
                use_points_boolean: values.use_points_boolean,
                promotion_code: values.promotion_code,
                payment_proof: pictureUrl,
                event_id: event.event_id,
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user.authentication_token}`,
              },
            },
          );

          const data = await response.json();

          if (response.ok) {
            toast.success(
              data.message ||
                'Transaction successfully completed! Redirecting you soon...',
            );
          } else {
            toast.error(data.message || 'Something went wrong!');
          }
        } catch (error) {
          console.error(error);
          toast.error('Network error. Please try again later.');
        }
      };

      try {
        setDisabled(true);
        const pictureUrl = await uploadTransactionPicture();
        await updateTransaction(pictureUrl);
        setTimeout(() => {
          router.push('/my-tickets');
        }, 2000);
      } catch (error) {
        setDisabled(false);
      }
    },
  });

  useEffect(() => {
    // if (!event) return;

    console.log(
      'useEffect triggered, use_points_boolean:',
      formik.values.use_points_boolean,
    );
    console.log(
      'Updated grand total before points:',
      updatedGrandTotalBeforePoints,
    );
    console.log('User points:', session?.user.points);
    console.log('Current updatedGrandTotal:', updatedGrandTotal);

    if (
      formik.values.use_points_boolean &&
      session?.user.points !== undefined &&
      typeof session?.user.points === 'number'
    ) {
      if (updatedGrandTotalBeforePoints - session?.user.points >= 0) {
        return setUpdatedGrandTotal(
          updatedGrandTotalBeforePoints - session?.user.points,
        );
      } else {
        return setUpdatedGrandTotal(0);
      }
    }

    if (
      !formik.values.use_points_boolean &&
      session?.user.points !== undefined &&
      typeof session?.user.points === 'number'
    ) {
      return setUpdatedGrandTotal(updatedGrandTotalBeforePoints);
    }
  }, [
    formik.values.use_points_boolean,
    event,
    session?.user.points,
    updatedGrandTotalBeforePoints,
  ]);

  useEffect(() => {
    async function getTicketTypeDetails() {
      if (!event?.TransactionTickets) return;

      try {
        const ticketDetails = await Promise.all(
          event.TransactionTickets.map(async (transactionTicket) => {
            const response = await api(
              `tickets/my-tickets/${transactionTicket.ticket_id}`,
              'GET',
            );
            return response.data;
          }),
        );

        setTicketTypeDetails(ticketDetails);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    }

    getTicketTypeDetails();
  }, [event]);

  console.log(
    'updated Grand total before points =>',
    updatedGrandTotalBeforePoints,
  );
  console.log('updated grand total after points =>', updatedGrandTotal);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-screen-md flex flex-col gap-8 m-12">
        <div>
          <h1 className=" font-semibold text-3xl">Complete Transaction</h1>
          <p className="mt-1">{`Please add in your transaction details.`}</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="promotion_code">Promotion Code (optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="promotion_code"
                id="title"
                className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
                placeholder="XXXX-XXXX-XXXX"
                value={formik.values.promotion_code}
                onChange={formik.handleChange}
              />
              <button
                className={
                  disabled
                    ? 'text-white bg-secondaryOrange p-4 rounded-[12px]'
                    : 'text-white bg-primaryOrange hover:bg-secondaryOrange p-4 rounded-[12px] whitespace-nowrap'
                }
                disabled={disabledPromoFields}
                onClick={applyPromotionCode}
                type="button"
              >
                {disabled ? 'Applying' : 'Apply Code'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="picture">Upload Payment Proof</label>
            <input
              type="file"
              id="picture"
              name="picture"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  formik.setFieldValue('picture', file);
                }
              }}
            />
            {formik.touched.picture && formik.errors.picture && (
              <div className="text-red-500 text-sm">
                {formik.errors.picture}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="use_points_boolean"
              name="use_points_boolean"
              checked={formik.values.use_points_boolean}
              onChange={(e) => {
                console.log('Checkbox changed:', e.target.checked); // Check if this logs
                formik.setFieldValue('use_points_boolean', e.target.checked);
              }}
            />
            <label htmlFor="use_points_boolean">Use Points</label>
          </div>

          <div className="text-xl font-bold">Review Tickets</div>

          {ticketTypeDetails.map((transactionTicket, i) => {
            return (
              <div className="flex justify-between w-full rounded-[12px] border border-[#D4D7E3] p-2">
                <div>{transactionTicket.title}</div>
                <div>{event?.TransactionTickets[i].quantity} Ticket(s)</div>
              </div>
            );
          })}

          <div className="text-2xl font-bold">
            Grand Total: {updatedGrandTotal.toLocaleString()}
          </div>

          <button
            className={
              disabled
                ? 'text-white bg-secondaryOrange p-4 rounded-[12px]'
                : 'text-white bg-primaryOrange hover:bg-secondaryOrange p-4 rounded-[12px]'
            }
            disabled={disabled}
          >
            Complete Transaction
          </button>
        </form>

        <center>
          <Link href={'/my-tickets'} className="text-[#1E4AE9]">
            Cancel
          </Link>
          <Toaster richColors className=""></Toaster>
        </center>
      </div>
    </div>
  );
}
