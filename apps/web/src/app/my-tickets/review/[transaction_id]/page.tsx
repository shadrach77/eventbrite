'use client';
import ScreenCenter from '@/components/global/ScreenCenter';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Toaster, toast } from 'sonner';
import * as Yup from 'yup';
import Link from 'next/link';
import { ITransaction } from '@/types/event.interface';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    transaction_id: string;
  };
};

const validationSchema = Yup.object({
  rating: Yup.number().min(1).max(5).required('Please select your rating.'),
  description: Yup.string().required('Please enter your review.'),
});

function page({ params: { transaction_id } }: Props) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [transactionDetails, setTransactionDetails] = useState<ITransaction>();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    try {
      async function getTransactions() {
        const response = await api(`transactions/${transaction_id}`, 'GET');
        setTransactionDetails(response.data);
      }

      getTransactions();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  }, [transaction_id]);

  useEffect(() => {
    try {
      async function getExistingReview() {
        const response = await api(
          `reviews/byTransactionId/${transaction_id}`,
          'GET',
        );

        if (response.data) {
          setDisabled(true);
        }
      }

      getExistingReview();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  }, [transaction_id]);

  const formik = useFormik({
    initialValues: {
      rating: 5,
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);
        const response = await api(
          `reviews/`,
          'POST',
          {
            body: {
              ...values,
              transaction_id: transactionDetails?.id,
              event_id: transactionDetails?.event_id,
            },
            contentType: 'application/json',
          },
          session?.user.authentication_token,
        );

        if (response) {
          toast.success(
            response.message ||
              'Review successfully submitted! Redirecting you soon...',
          );
          setTimeout(() => {
            router.push('/my-tickets');
          }, 3000);
        } else {
          toast.error(response.message || 'Something went wrong!');
          setDisabled(false);
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong!');
        setDisabled(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center w-full">
      {' '}
      <div className="w-full max-w-screen-md flex flex-col gap-8 m-12">
        <div className="flex flex-col gap-8 w-full">
          <div>
            <h1 className=" font-semibold text-3xl text-primaryOrange">
              Add Review
            </h1>
            <p className="mt-1 text-secondaryOrange font-semibold">{`Please add in your review details.`}</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div
              className={
                disabled
                  ? 'flex flex-col gap-2 bg-secondaryBackground font-semibold text-yellow-600 px-4 py-2 rounded-md cursor-default'
                  : 'hidden'
              }
            >
              You have reviewed this transaction before. You can read this
              review, but you cannot modify it.
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="rating">Your Rating</label>
              <select
                name="rating"
                id="rating"
                className={
                  disabled
                    ? 'w-full border-0 px-1 py-2 border-primaryOrange border-b-2 bg-transparent cursor-not-allowed'
                    : 'w-full border-0 px-1 py-2 border-primaryOrange border-b-2 bg-transparent'
                }
                value={formik.values.rating}
                onChange={formik.handleChange}
                disabled={disabled}
              >
                <option className="text-[#F7FBFF]" disabled>
                  All Ratings
                </option>
                <option value={1}>1 - Poor</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5 - Excellent</option>
              </select>
              {formik.touched.rating && formik.errors.rating && (
                <div className="text-red-500 text-sm">
                  {formik.errors.rating}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description">Description</label>
              <textarea
                rows={8}
                name="description"
                id="description"
                className={
                  disabled
                    ? 'bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4 cursor-not-allowed'
                    : 'bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4'
                }
                placeholder="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                disabled={disabled}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm">
                  {formik.errors.description}
                </div>
              )}
            </div>

            <button
              className={
                disabled
                  ? 'text-white bg-secondaryOrange p-4 rounded-[12px] cursor-not-allowed'
                  : 'text-white bg-primaryOrange hover:bg-secondaryOrange p-4 rounded-[12px]'
              }
              disabled={disabled}
              type="submit"
            >
              Submit Review
            </button>
          </form>
        </div>
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

export default page;
