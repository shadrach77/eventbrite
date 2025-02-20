'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { ITransaction } from '@/types/event.interface';
import MyTicketTableHead from './MyTicketTableHead';
import MyTicketTableBody from './MyTicketTableBody';

function MyTicketTable() {
  const { data: session } = useSession();
  const [myTransactions, setMyTransactions] = useState<ITransaction[]>([]);
  console.log('AUTH TOKEN =>', session?.user.authentication_token);

  useEffect(() => {
    async function getTransactions() {
      try {
        const response = await api(
          'transactions/my-transactions',
          'GET',
          {},
          session?.user.authentication_token,
        );
        setMyTransactions(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getTransactions();
  }, [session?.user.authentication_token]);

  return (
    <div className="w-3/4">
      <MyTicketTableHead setMyTransactions={setMyTransactions} />
      {myTransactions.map((transaction) => {
        return (
          <MyTicketTableBody
            key={transaction.id}
            {...transaction}
            setMyTransactions={setMyTransactions}
          />
        );
      })}
    </div>
  );
}

export default MyTicketTable;
