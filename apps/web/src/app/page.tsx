'use client';
import Navbar from '@/components/global/Navbar';
import ScreenCenter from '@/components/global/ScreenCenter';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="w-screen flex justify-center min-w-[320px] overflow-x-scroll">
      <ScreenCenter>
        <Navbar></Navbar>
      </ScreenCenter>
    </div>
  );
}
