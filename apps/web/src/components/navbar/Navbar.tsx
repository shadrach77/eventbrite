'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import eventbriteSmallLogo from '@/media/logos/eventbrite-icon-small.svg';
import eventbriteBigLogo from '@/media/logos/eventbrite-icon-big.svg';
import searchIcon from '@/media/icons/search-icon.svg';
import searchIconWhite from '@/media/icons/search-icon-white.svg';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import NavbarProfile from './NavbarProfile';

function Navbar() {
  const [searchedValue, setSearchedValue] = useState('');
  const { data: session, status } = useSession();
  return (
    <header className="flex justify-center items-center px-6 py-2 w-screen sticky z-20 shadow-md">
      <nav className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center justify-between h-12 w-full gap-4 ">
          <Link href={'/'} className="h-7 w-7 block lg:hidden flex-shrink-0">
            <Image
              src={eventbriteSmallLogo}
              alt="Eventbrite Logo"
              className="h-7 w-7 block lg:hidden flex-shrink-0"
            ></Image>
          </Link>

          <Link href={'/'} className="h-28 w-28 hidden lg:block flex-shrink-0">
            <Image
              src={eventbriteBigLogo}
              alt="Eventbrite Logo"
              className="h-28 w-28 hidden lg:block flex-shrink-0"
            ></Image>
          </Link>

          <div
            className={
              session?.user.role === 'ORGANIZER'
                ? 'hidden'
                : ' hidden md:flex max-w-[43.75rem] justify-center items-center h-10 w-full relative'
            }
          >
            <Image
              src={searchIcon}
              alt="search icon"
              className="absolute left-4 top-2 w-6 h-6"
            ></Image>
            <input
              type="text"
              value={searchedValue}
              placeholder="Search events"
              className="w-full h-full px-14 bg-secondaryBackground rounded-3xl"
              onChange={(e) => {
                setSearchedValue(e.target.value);
              }}
            ></input>
            <Link
              href={`/search?q=${searchedValue}`}
              className="absolute right-1 top-1 h-8 w-8 flex justify-center items-center rounded-3xl bg-primaryOrange hover:bg-secondaryOrange "
            >
              <Image
                src={searchIconWhite}
                alt="search icon"
                className=" w-4 h-4 fill-white"
              ></Image>
            </Link>
          </div>
          <div
            className={
              session
                ? 'flex gap-4 text-secondaryText h-full'
                : 'flex gap-2 text-secondaryText h-full'
            }
          >
            <div
              className={
                session
                  ? 'hidden'
                  : 'whitespace-nowrap hidden lg:flex items-center h-full px-4 rounded-3xl hover:bg-secondaryBackground cursor-pointer'
              }
            >
              Help Center
            </div>
            <div
              className={
                session
                  ? 'hidden'
                  : 'whitespace-nowrap hidden lg:flex items-center h-full px-4 rounded-3xl hover:bg-secondaryBackground cursor-pointer'
              }
            >
              Contact Sales
            </div>
            {session ? (
              session.user.role === 'ORGANIZER' ? (
                <Link
                  href={'/dashboard'}
                  className="whitespace-nowrap hidden lg:flex items-center h-full px-4 rounded-3xl hover:bg-secondaryBackground"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href={'/my-tickets'}
                  className="whitespace-nowrap hidden lg:flex items-center h-full px-4 rounded-3xl hover:bg-secondaryBackground"
                >
                  My Tickets
                </Link>
              )
            ) : (
              <Link
                href={'/sign-in'}
                className="whitespace-nowrap flex items-center h-full px-4 rounded-3xl hover:bg-secondaryBackground"
              >
                Sign In
              </Link>
            )}
            {session ? (
              <NavbarProfile />
            ) : (
              <Link
                href={'/sign-up'}
                className="whitespace-nowrap flex items-center h-full px-4 rounded-3xl hover:bg-secondaryBackground"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>

        <div
          className={
            session?.user.role === 'ORGANIZER'
              ? 'hidden'
              : ' flex md:hidden justify-center items-center h-10 w-full relative'
          }
        >
          <Image
            src={searchIcon}
            alt="search icon"
            className="absolute left-4 top-2 w-6 h-6"
          ></Image>
          <input
            type="text"
            placeholder="Search events"
            value={searchedValue}
            className="w-full h-full px-14 bg-secondaryBackground rounded-3xl"
            onChange={(e) => {
              setSearchedValue(e.target.value);
            }}
          ></input>
          <Link
            href={`/search?q=${searchedValue}`}
            className="absolute right-1 top-1 h-8 w-8 flex justify-center items-center rounded-3xl bg-primaryOrange hover:bg-secondaryOrange "
          >
            <Image
              src={searchIconWhite}
              alt="search icon"
              className=" w-4 h-4 fill-white"
            ></Image>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
