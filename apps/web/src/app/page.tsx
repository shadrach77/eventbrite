'use client';
import Navbar from '@/components/global/Navbar';
import ScreenCenter from '@/components/global/ScreenCenter';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <p>
        You are not logged in. <a href="/login">Sign in</a>
      </p>
    );
  }

  return (
    <ScreenCenter>
      <Navbar></Navbar>
    </ScreenCenter>
  );
}
