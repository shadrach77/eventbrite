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

        <form>
          {' '}
          <select
            name="location"
            id="location"
            className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4 appearance-none focus:outline-1"
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
                    {location.label.toLocaleUpperCase()}
                  </option>
                );
              })}
          </select>
        </form>
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
