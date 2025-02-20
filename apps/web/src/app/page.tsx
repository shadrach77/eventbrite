'use client';
import Navbar from '@/components/navbar/Navbar';
import ScreenCenter from '@/components/global/ScreenCenter';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Carousel from '@/components/home/Carousel';
import FilterEvents from '@/components/home/FilteredEvents';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <ScreenCenter>
      <Carousel />
      <FilterEvents />
    </ScreenCenter>
  );
}
