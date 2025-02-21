'use client';
import { api } from '@/helpers/api';
import { IEvent } from '@/types/event.interface';
import React, { useEffect, useState } from 'react';
import defaultEventPicture from '@/media/default/eventbrite_default_event_picture.jpg';
import defaultProfilePicture from '@/media/icons/profile-icon.svg';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';

interface ILocation {
  id: string;
  label: string;
}
interface ICategory {
  id: string;
  label: string;
}

function EventCard({
  title,
  picture,
  start_date,
  end_date,
  location_id,
  organizer_id,
  id,
  category_id,
}: IEvent) {
  const [locationName, setLocationName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  useEffect(() => {
    async function getAllLocations() {
      try {
        const locations = await api('locations', 'GET');
        const matchingLocation = await locations.data.find(
          (location: ILocation) => {
            return location.id === location_id;
          },
        );
        setLocationName(
          matchingLocation.label.charAt(0).toUpperCase() +
            matchingLocation.label.slice(1).toLowerCase(),
        );
      } catch (error) {
        console.log(error);
      }
    }

    async function getAllCategories() {
      try {
        const categories = await api('categories', 'GET');
        const matchingCategory = await categories.data.find(
          (category: ICategory) => {
            return category.id === category_id;
          },
        );
        setCategoryName(
          matchingCategory.label.charAt(0).toUpperCase() +
            matchingCategory.label.slice(1).toLowerCase(),
        );
      } catch (error) {
        console.log(error);
      }
    }

    async function getOrganizerName() {
      try {
        const events = await api('events', 'GET');
        const matchingEvent = await events.data.find((event: IEvent) => {
          return event.id === id;
        });
        setOrganizerName((matchingEvent as IEvent).organizer.full_name);
      } catch (error) {
        console.log(error);
      }
    }

    getAllLocations();
    getAllCategories();
    getOrganizerName();
  }, [location_id, id]);

  return (
    <Link
      href={`/events/${id}`}
      className="flex flex-col w-72 bg-black hover:shadow-2xl shadow-secondaryText"
    >
      <div className="w-full h-36">
        <Image
          src={picture ? picture : defaultEventPicture}
          alt={`${title} event picture`}
          width={500}
          height={500}
          className=" h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 w-ful p-3 bg-white">
        <div className="w-full text-lg text-secondaryText">{title}</div>
        <div className="w-full text-sm text-secondaryText">
          {dayjs(start_date).format('MMM DD, YYYY')} {'- '}
          {dayjs(end_date).format('MMM DD, YYYY')}
        </div>
        <div className="w-full text-sm font-light text-secondaryText">
          {locationName}
        </div>
        <div className="w-full text-sm text-secondaryText">
          Tag: {categoryName}
        </div>
        <div className="w-full flex flex-row items-center gap-1">
          <Image
            src={defaultProfilePicture}
            alt={'Organizer Profile Picture'}
            className="h-4 w-4 rounded-3xl"
          />

          <div className="text-sm text-secondaryText">{organizerName}</div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
