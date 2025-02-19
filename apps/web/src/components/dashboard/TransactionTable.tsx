'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { IEvent, ITransaction } from '@/types/event.interface';
import TransactionTableHead from './TransactionTableHead';
import TransactionTableBody from './TransactionTableBody';

function TransactionTable() {
  const { data: session } = useSession();
  const [myTransactions, setMyTransactions] = useState<ITransaction[]>([]);
  console.log(
    'session.user.authentication_token =>',
    session?.user.authentication_token,
  );

  useEffect(() => {
    async function getTransactions() {
      try {
        const response = await api(
          'transactions/my-admin-transactions',
          'GET',
          {},
          session?.user.authentication_token,
        );

        setMyTransactions(
          response.data.filter((transaction: ITransaction) => {
            return String(transaction.status) === 'PENDING_ADMIN_CONFIRMATION';
          }),
        );
        // setMyTransactions(response.data);
        console.log(
          'session.user.authentication_token =>',
          session?.user.authentication_token,
        );
      } catch (error) {
        console.log(error);
      }
    }
    getTransactions();
  }, [session?.user.authentication_token]);
  return (
    <div className="w-3/4">
      <TransactionTableHead />
      {myTransactions.map((transaction) => {
        return (
          <TransactionTableBody
            key={transaction.id}
            {...transaction}
            setMyTransactions={setMyTransactions}
          />
        );
      })}
    </div>
  );
}

export default TransactionTable;
