import Image from 'next/image';
import React from 'react';
import browseIcon from '@/media/icons/browse-icon.svg';
import Link from 'next/link';
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';
import { ITransaction } from '@/types/event.interface';
import { toast, Toaster } from 'sonner';
import trashIcon from '@/media/icons/trash-icon.svg';

function MyTicketTableHead({
  setMyTransactions,
}: {
  setMyTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>;
}) {
  const { data: session, update } = useSession();
  async function deleteJunkTickets() {
    try {
      const deletedJunkTickets = await api(
        `transactions/my-transactions/junk/hard_delete`,
        'DELETE',
        {},
        session?.user.authentication_token,
      );

      if (deletedJunkTickets.data) {
        toast.success('Junk Transactions Deleted Successfully.');
      }

      setMyTransactions((prevTransactions: ITransaction[]) => {
        return prevTransactions.filter((prevTransaction) => {
          return [
            'DONE',
            'PENDING_PAYMENT',
            'PENDING_ADMIN_CONFIRMATION',
          ].includes(prevTransaction.status);
        });
      });
    } catch (error) {
      toast.error('Junk Transactions Deletion failed');
    }
  }

  return (
    <div className="flex flex-row justify-between items-center px-4 py-2 w-full bg-blue-400">
      <div className="text-secondaryText">My Tickets</div>
      <div className="flex gap-2">
        {' '}
        <button
          onClick={deleteJunkTickets}
          className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-red-600"
        >
          <div>Delete Junk Tickets</div>
          <Image src={trashIcon} alt="plus icon" className="h-5 w-5"></Image>
        </button>
        <Link
          href={'/'}
          className="flex gap-1.5 items-center py-1 px-2 rounded-sm text-white bg-green-600"
        >
          <div>Browse For Tickets</div>
          <Image src={browseIcon} alt="plus icon" className="h-5 w-5"></Image>
        </Link>
      </div>

      <Toaster richColors></Toaster>
    </div>
  );
}

export default MyTicketTableHead;
