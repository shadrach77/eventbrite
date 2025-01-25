import Image from 'next/image';
import React from 'react';
import eventbriteSmallLogo from '@/media/logos/eventbrite-icon-small.svg';
import eventbriteBigLogo from '@/media/logos/eventbrite-icon-big.svg';
import searchIcon from '@/media/icons/search-icon.svg';
import searchIconWhite from '@/media/icons/search-icon-white.svg';

function Navbar() {
  return (
    <header className="flex justify-center items-center px-6 py-2 w-screen bg-red-200">
      <nav className="flex flex-col items-center w-full bg-green-200">
        <div className="flex items-center justify-between h-12 w-full gap-4">
          <Image
            src={eventbriteSmallLogo}
            alt="Eventbrite Logo"
            className="h-7 w-7 block lg:hidden"
          ></Image>
          <Image
            src={eventbriteBigLogo}
            alt="Eventbrite Logo"
            className="h-28 w-28 hidden lg:block"
          ></Image>
          <div className=" hidden md:flex max-w-[43.75rem] justify-center items-center h-10 w-full relative">
            <Image
              src={searchIcon}
              alt="search icon"
              className="absolute left-4 top-2 bg-purple-200 w-6 h-6"
            ></Image>
            <input
              type="text"
              placeholder="Search events"
              className="w-full h-full px-14 bg-secondaryBackground rounded-3xl"
            ></input>
            <div className="absolute right-1 top-1 h-8 w-8 flex justify-center items-center rounded-3xl bg-secondaryOrange ">
              <Image
                src={searchIconWhite}
                alt="search icon"
                className=" w-4 h-4 fill-white"
              ></Image>
            </div>
          </div>
          <div className="flex gap-12 text-secondaryText">
            <div className="whitespace-nowrap hidden lg:block">Help Center</div>
            <div className="whitespace-nowrap hidden lg:block">
              Contact Sales
            </div>
            <div className="whitespace-nowrap">Login</div>
            <div className="whitespace-nowrap">Sign Up</div>
          </div>
        </div>

        <div className=" flex md:hidden justify-center items-center h-10 w-full relative">
          <Image
            src={searchIcon}
            alt="search icon"
            className="absolute left-4 top-2 bg-purple-200 w-6 h-6"
          ></Image>
          <input
            type="text"
            placeholder="Search events"
            className="w-full h-full px-14 bg-secondaryBackground rounded-3xl"
          ></input>
          <div className="absolute right-1 top-1 h-8 w-8 flex justify-center items-center rounded-3xl bg-secondaryOrange ">
            <Image
              src={searchIconWhite}
              alt="search icon"
              className=" w-4 h-4 fill-white"
            ></Image>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
