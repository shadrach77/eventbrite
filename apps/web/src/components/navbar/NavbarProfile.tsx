'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import profileIcon from '@/media/icons/profile-icon.svg';
import Link from 'next/link';

function NavbarProfile() {
  const { data: session, status } = useSession();
  return (
    <div className="whitespace-nowrap flex items-center h-full px-4 bg-blue-400 relative group hover:bg-secondaryBackground z-20">
      <div className="flex items-center gap-2 ">
        <Image
          src={
            session?.user.profile_picture
              ? String(session.user.profile_picture)
              : profileIcon
          }
          alt="profile picture"
          className="h-10 w-10 p-2 rounded-3xl bg-green-200"
        ></Image>
        <div>{session?.user.email}</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 translate-y-full hidden group-hover:flex flex-col bg-white">
        {session?.user.role === 'ORGANIZER' ? (
          <Link
            href={'/dashboard'}
            className="h-12 flex items-center px-4 hover:bg-secondaryBackground"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href={'/'}
            className="h-12 flex items-center px-4 hover:bg-secondaryBackground"
          >
            Browse Events
          </Link>
        )}
        {session?.user.role === 'ORGANIZER' ? (
          <Link
            href={'/'}
            className="h-12 flex items-center px-4 hover:bg-secondaryBackground"
          >
            My Events
          </Link>
        ) : (
          <Link
            href={'/my-tickets'}
            className="h-12 flex items-center px-4 hover:bg-secondaryBackground"
          >
            My Tickets
          </Link>
        )}
        <button
          onClick={() => {
            signOut({
              redirectTo: '/',
            });
          }}
          className="h-12 flex items-center px-4 hover:bg-secondaryBackground"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default NavbarProfile;
