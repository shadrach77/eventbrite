'use client';
import { api } from '@/helpers/api';
import { IEvent } from '@/types/event.interface';
import { filter } from 'cypress/types/bluebird';
import React, { useEffect, useState } from 'react';

interface ILocation {
  id: string;
  label: string;
}

interface ICategory {
  id: string;
  label: string;
}

function FilterEvents() {
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [allLocations, setAllLocations] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [selectedLocationId, setSelectedLocationId] = useState('0');
  const [selectedCategoryId, setSelectedCategoryId] = useState('0');

  useEffect(() => {
    async function getAllLocations() {
      try {
        const locations = await api('locations', 'GET');
        setAllLocations(locations.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAllCategories() {
      try {
        const categories = await api('categories', 'GET');
        setAllCategories(categories.data);
      } catch (error) {
        console.log(error);
      }
    }

    getAllLocations();
    getAllCategories();
  }, []);

  useEffect(() => {
    async function getAllEvents() {
      try {
        const locations = await api('events/', 'GET');
        setFilteredEvents(locations.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAllEventsByLocationIdAndCategoryId() {
      try {
        if (selectedLocationId === '0') {
          setSelectedLocationId('');
        }
        if (selectedCategoryId === '0') {
          setSelectedCategoryId('');
        }
        const events = await api(
          `events?location_id=${selectedLocationId}&category_id=${selectedCategoryId}`,
          'GET',
          {},
        );
        setFilteredEvents(events.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (selectedLocationId === '0' && selectedCategoryId === '0') {
      getAllEvents();
    } else {
      getAllEventsByLocationIdAndCategoryId();
    }
  }, [selectedLocationId, selectedCategoryId]);

  return (
    <>
      <div className="mt-8 flex h-16 items-center border-t border-b border-gray-500 w-full">
        <div>Browsing Events In</div>

        <form className="ml-1">
          {' '}
          <select
            name="location"
            id="location"
            className=" w-full border-0 px-1 py-2 border-primaryOrange border-b-2 bg-transparent"
            value={selectedLocationId}
            onChange={(e) => {
              setSelectedLocationId(e.target.value);
            }}
          >
            <option value="0" className="text-[#F7FBFF]">
              All Locations
            </option>
            {allLocations &&
              allLocations.map((location: ILocation) => {
                return (
                  <option value={location.id} key={location.id}>
                    {location.label.charAt(0).toUpperCase() +
                      location.label.slice(1).toLowerCase()}
                  </option>
                );
              })}
          </select>
        </form>
      </div>
      <div className="flex gap-4 mt-5 w-full">
        {allCategories.map((category: ICategory) => (
          <label key={category.id}>
            <input
              type="radio"
              name="category"
              value={String(category.id)}
              checked={selectedCategoryId === category.id}
              onChange={() => setSelectedCategoryId(category.id)}
              className="hidden"
            />
            <span
              className={`px-4 py-2 rounded-full cursor-pointer transition ${
                selectedCategoryId === category.id
                  ? 'bg-blueAccent text-white shadow-md'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category.label}
            </span>
          </label>
        ))}
      </div>
      <div>
        {filteredEvents.map((event: IEvent) => {
          return <div key={event.id}>{event.title}</div>;
        })}
      </div>
    </>
  );
}

export default FilterEvents;
