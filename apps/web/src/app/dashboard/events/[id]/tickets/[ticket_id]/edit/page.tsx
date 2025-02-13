'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/helpers/api';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: {
    ticket_id: string;
  };
};

interface ICurrFormData {
  id: string;
  event_id: string;
  title: string;
  price: number;
  available_seats: number;
  start_date: any;
  end_date: any;
  created_at: any;
  updated_at: any;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Please enter a title for this ticket type.'),
  price: Yup.number().required(
    'Please set a valid price. Enter "0" if this ticket is free.',
  ),
  available_seats: Yup.number().required(
    `Please set a valid price. Enter "0" if this ticket is free`,
  ),
  start_date: Yup.date()
    .required('Please select a valid date.')
    .min(new Date(), "Start date must be after today's date"),
  end_date: Yup.date()
    .required('Please select a valid date')
    .test(
      'is-after-start',
      'End date must be on or after the start date',
      function (value) {
        const { start_date } = this.parent;
        return value && start_date && new Date(value) >= new Date(start_date);
      },
    ),
});

function Page({ params: { ticket_id } }: Props) {
  const { data: session } = useSession();
  const [currFormData, setCurrFormData] = useState<ICurrFormData | null>(null);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFormData() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/tickets/my-tickets/${ticket_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.authentication_token}`,
            },
          },
        );

        if (!response.ok) {
          console.log('Error fetching data:', response.statusText);
          return;
        }

        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          console.log('currFormData =>', data.data);
          setCurrFormData(data.data);
        } else {
          console.error('Unexpected response format:', await response.text());
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    if (session) {
      getFormData();
    }
  }, [session, ticket_id]);

  //formik

  const formik = useFormik({
    initialValues: {
      title: currFormData?.title,
      price: currFormData?.price,
      available_seats: currFormData?.available_seats,
      start_date: currFormData?.start_date
        ? new Date(currFormData.start_date).toISOString().split('T')[0]
        : '',
      end_date: currFormData?.end_date
        ? new Date(currFormData.end_date).toISOString().split('T')[0]
        : '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const updateEvent = async (pictureUrl: string | void) => {
        try {
          const response: any = await fetch(
            `http://localhost:8000/api/tickets/my-tickets/${ticket_id}`,
            {
              method: 'PATCH',
              body: JSON.stringify({
                id: currFormData?.id,
                ...values,
                event_id: currFormData?.event_id,
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
                'Ticket Type successfully created! Redirecting you soon...',
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
        await updateEvent();
        setTimeout(() => {
          router.push(`/dashboard/events/${currFormData?.event_id}`);
        }, 2000);
      } catch (error) {
        setDisabled(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-screen-md flex flex-col gap-8 m-12">
        <div>
          <h1 className=" font-semibold text-3xl">Edit A Ticket Type</h1>
          <p className="mt-1">{`Please change in your ticket details.`}</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="0"
              value={formik.values.price}
              onChange={formik.handleChange}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-500 text-sm">{formik.errors.price}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="available_seats">Available Seats</label>
            <input
              type="number"
              name="available_seats"
              id="available_seats"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="0"
              value={formik.values.available_seats}
              onChange={formik.handleChange}
            />
            {formik.touched.available_seats &&
              formik.errors.available_seats && (
                <div className="text-red-500 text-sm">
                  {formik.errors.available_seats}
                </div>
              )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="start_date">Start Date</label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              value={formik.values.start_date}
              onChange={formik.handleChange}
            />
            {formik.touched.start_date && formik.errors.start_date && (
              <div className="text-red-500 text-sm">
                {formik.errors.start_date}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="end_date">End Date</label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              value={formik.values.end_date}
              onChange={formik.handleChange}
            />
            {formik.touched.end_date && formik.errors.end_date && (
              <div className="text-red-500 text-sm">
                {formik.errors.end_date}
              </div>
            )}
          </div>

          <button
            className={
              disabled
                ? 'text-white bg-[#963232] p-4 rounded-[12px]'
                : 'text-white bg-[#162D3A] p-4 rounded-[12px]'
            }
            disabled={disabled}
          >
            Add Ticket Type
          </button>
        </form>

        <center>
          <Link
            href={'/dashboard/events/${currFormData?.event_id}'}
            className="text-[#1E4AE9]"
          >
            Cancel
          </Link>
          <Toaster richColors className=""></Toaster>
        </center>
      </div>
    </div>
  );
}

export default Page;
