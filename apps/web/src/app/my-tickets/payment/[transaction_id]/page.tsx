'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import * as Yup from 'yup';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ITransaction } from '@/types/event.interface';

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
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [eventId, setEventId] = useState('');

  useEffect(() => {
    async function getEventId() {
      try {
        const response = await api(`transactions/${transaction_id}`, 'GET');
        const event_id = (response.data as ITransaction).event_id;
        setEventId(event_id);
      } catch (error) {
        toast.error('Failed to fetch event ID.');
        console.error(error);
      }
    }
    getEventId();
  }, [transaction_id]);

  const formik = useFormik({
    initialValues: {
      use_points_boolean: true,
      promotion_code: '',
      picture: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!eventId) {
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
                event_id: eventId,
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
          // router.push('/my-tickets');
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
          <h1 className=" font-semibold text-3xl">Complete Transaction</h1>
          <p className="mt-1">{`Please add in your transaction details.`}</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="promotion_code">Promotion Code (optional)</label>
            <input
              type="text"
              name="promotion_code"
              id="title"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="XXXX-XXXX-XXXX"
              value={formik.values.promotion_code}
              onChange={formik.handleChange}
            />
            {formik.touched.promotion_code && formik.errors.promotion_code && (
              <div className="text-red-500 text-sm">
                {formik.errors.promotion_code}
              </div>
            )}
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
              onChange={formik.handleChange}
            />
            <label htmlFor="use_points_boolean">Use Points</label>
          </div>

          <button
            className={
              disabled
                ? 'text-white bg-[#963232] p-4 rounded-[12px]'
                : 'text-white bg-[#162D3A] p-4 rounded-[12px]'
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
