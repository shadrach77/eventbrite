'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import * as Yup from 'yup';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

const validationSchema = Yup.object({
  code: Yup.string().required('Please enter a promotion code.'),
  amount: Yup.number().required('Please set the discount amount.'),
  start_date: Yup.date()
    .required('Please select a valid date.')
    .test(
      'is-today-or-after',
      'Start date must be today or anytime after today',
      function (value) {
        if (!value) return false;

        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0); // Normalize time to start of the day

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize current date

        return selectedDate >= today;
      },
    ),
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
export default function Page({ params: { id } }: Props) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: '',
      amount: '',
      start_date: '',
      end_date: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const createPromotion = async () => {
        try {
          const response: any = await fetch(
            'http://localhost:8000/api/promotions/my-promotions',
            {
              method: 'POST',
              body: JSON.stringify({
                ...values,
                event_id: id,
                start_date: values.start_date,
                end_date: values.end_date,
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
                'Promotion successfully created! Redirecting you soon...',
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
        await createPromotion();
        setTimeout(() => {
          router.push(`/dashboard/events/${id}`);
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
          <h1 className=" font-semibold text-3xl text-primaryOrange">
            Create A Promotion
          </h1>
          <p className="mt-1 text-secondaryOrange font-semibold">{`Please add in your promotion details.`}</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="code">Code</label>
            <input
              type="text"
              name="code"
              id="cpde"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="code"
              value={formik.values.code}
              onChange={formik.handleChange}
            />
            {formik.touched.code && formik.errors.code && (
              <div className="text-red-500 text-sm">{formik.errors.code}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="0"
              value={formik.values.amount}
              onChange={formik.handleChange}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500 text-sm">{formik.errors.amount}</div>
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
                ? 'text-white bg-secondaryOrange p-4 rounded-[12px]'
                : 'text-white bg-primaryOrange hover:bg-secondaryOrange p-4 rounded-[12px]'
            }
            disabled={disabled}
          >
            Create Promotion
          </button>
        </form>

        <center>
          <Link href={`/dashboard/events/${id}`} className="text-[#1E4AE9]">
            Cancel
          </Link>
          <Toaster richColors className=""></Toaster>
        </center>
      </div>
    </div>
  );
}
