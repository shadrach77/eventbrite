'use client';

import React from 'react';
import gearIcon from '@/media/icons/gear-icon.svg';
import Image from 'next/image';
import { IEvent, ITransaction } from '@/types/event.interface';
import Link from 'next/link';
import { api } from '@/helpers/api';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';

function TransactionTableBody({
  id,
  grand_total,
  payment_proof,
  acceptance_deadline,
  setMyTransactions,
}: ITransaction & {
  setMyTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>;
}) {
  const { data: session } = useSession();

  const onReject = async () => {
    async function rejectTransaction() {
      const response = await fetch(
        `http://localhost:8000/api/transactions/reject/${id}`,
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

      toast.success('Transaction rejected successfully.');
      setMyTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id),
      );
    }

    try {
      await rejectTransaction();
    } catch (error) {
      console.log(error);
    }
  };

  const onAccept = async () => {
    async function acceptTransaction() {
      const response = await fetch(
        `http://localhost:8000/api/transactions/accept/${id}`,
        {
          method: 'POST',
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

      toast.success('Transaction accepted successfully.');
      setMyTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id),
      );
    }

    try {
      await acceptTransaction();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejection = () => {
    if (
      window.confirm(
        'Are you sure you want to reject this transaction? This action is not reversible',
      )
    ) {
      onReject();
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 w-full bg-blue-200">
      <div className="sm:truncate sm:flex-1">
        Payment Due: Rp.{grand_total.toLocaleString()}
      </div>
      <div className="flex gap-2 whitespace-nowrap">
        <button
          onClick={() => window.open(`${payment_proof}`, '_blank')}
          className="py-1 px-2 rounded-sm text-blueAccent underline"
        >
          View Payment Proof
        </button>
        <button
          onClick={() => {
            handleRejection();
          }}
          className="py-1 px-2 rounded-sm text-white bg-red-600"
        >
          Reject
        </button>

        <button
          className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600"
          onClick={onAccept}
        >
          <div>Accept</div>
          <Image src={gearIcon} alt="gear icon" className="h-4 w-4"></Image>
        </button>
      </div>
      <Toaster richColors></Toaster>
    </div>
  );
}

export default TransactionTableBody;
