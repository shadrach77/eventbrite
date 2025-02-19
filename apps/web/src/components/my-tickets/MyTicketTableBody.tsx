'use client';

import React, { useEffect, useState } from 'react';
import paymentIcon from '@/media/icons/payment-icon.svg';
import Image from 'next/image';
import { IEvent, ITransaction } from '@/types/event.interface';
import Link from 'next/link';
import { api } from '@/helpers/api';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';

function MyTicketTableBody({
  id,
  status,
  grand_total,
  payment_proof_deadline,
  event_id,
  setMyTransactions,
}: ITransaction & {
  setMyTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>;
}) {
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    async function getEventTitle() {
      const eventTitle = await api(`events/my-events/${event_id}`, 'GET');
      setEventTitle((eventTitle.data as IEvent).title);
    }

    getEventTitle();
  }, [event_id]);

  const { data: session } = useSession();
  const onCancel = async () => {
    async function deleteTransaction() {
      const response = await fetch(
        `http://localhost:8000/api/transactions/my-transactions/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.authentication_token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Something went wrong!');
      }

      toast.success('Transaction canceled successfully.');

      setMyTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === id
            ? { ...transaction, status: 'CANCELED' }
            : transaction,
        ),
      );
    }

    try {
      deleteTransaction();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelTransaction = () => {
    if (
      window.confirm(
        'Are you sure you want to cancel this transaction? This action is not reversible',
      )
    ) {
      onCancel();
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 w-full bg-blue-200">
      <div className="sm:truncate sm:flex-1">{eventTitle}</div>
      <div className="flex gap-2 whitespace-nowrap">
        <div className="py-1 px-2 rounded-sm text-white bg-secondaryText">
          {status}
        </div>
        <button
          onClick={() => {
            handleCancelTransaction();
          }}
          disabled={['DONE', 'REJECTED', 'EXPIRED', 'CANCELED'].includes(
            status,
          )}
          className={`py-1 px-2 rounded-sm text-white ${
            ['DONE', 'REJECTED', 'EXPIRED', 'CANCELED'].includes(status)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600'
          }`}
        >
          Cancel
        </button>

        {[
          'DONE',
          'REJECTED',
          'EXPIRED',
          'CANCELED',
          'PENDING_ADMIN_CONFIRMATION',
        ].includes(status) ? (
          <button
            disabled
            className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-gray-400 cursor-not-allowed"
          >
            <div>Pay</div>
            <Image src={paymentIcon} alt="payment icon" className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href={`/my-tickets/payment/${id}`}
            className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600"
          >
            <div>Pay</div>
            <Image src={paymentIcon} alt="payment icon" className="h-4 w-4" />
          </Link>
        )}
      </div>
      <Toaster richColors></Toaster>
    </div>
  );
}

export default MyTicketTableBody;
