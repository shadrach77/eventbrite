'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import * as Yup from 'yup';
import { api } from '@/helpers/api';

interface ICategory {
  id: string;
  label: string;
}

interface ILocation {
  id: string;
  label: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Please enter a title for your event.'),
  description: Yup.string().required(
    'Please enter a description for your event.',
  ),
  category: Yup.string().required('Please select a category.'),
  location: Yup.string().required('Please select a location.'),
  start_date: Yup.date()
    .required('Please select a valid date.')
    .min(new Date(), "Start date must be after today's date"),
  end_date: Yup.date()
    .required('Please select a valid date')
    .test(
      'is-after-start',
      'End date must be on or after the start date',
      function (value) {
        const { start_date } = this.parent;
        return value && start_date && new Date(value) >= new Date(start_date);
      },
    ),
  picture: Yup.string(),
});

export default function Page() {
  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      picture: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response: any = await fetch(
          'http://localhost:8000/api/auth/profile/new',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            next: {
              revalidate: 0,
            },
            body: JSON.stringify({
              title: values.title,
            }),
          },
        );

        // const response = await api('auth/profile/new', 'POST', {
        //   body: {
        //     email: values.email,
        //     password: values.password,
        //     full_name: values.full_name,
        //     role: values.role,
        //   },
        //   contentType: 'application/json',
        // });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || 'Registration successful!');
        } else {
          toast.error(data.message || 'Something went wrong!');
        }
      } catch (error) {
        console.error(error);
        toast.error('Network error. Please try again later.');
      }
    },
  });

  const [categories, setCategories] = useState<[]>([]);
  useEffect(() => {
    async function getCategories() {
      try {
        const categories = await api('categories', 'GET');
        setCategories(categories.data);
        console.log('categories =>', categories.data);
      } catch (error) {
        console.log(error);
      }
    }
    getCategories();
  }, []);

  const [locations, setLocations] = useState<[]>([]);
  useEffect(() => {
    async function getLocations() {
      try {
        const locations = await api('locations', 'GET');
        setLocations(locations.data);
        console.log('locations =>', locations.data);
      } catch (error) {
        console.log(error);
      }
    }
    getLocations();
  }, []);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-screen-md flex flex-col gap-8 m-12">
        <div>
          <h1 className=" font-semibold text-3xl">Create An Event</h1>
          <p className="mt-1">{`Please add in your event details.`}</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <textarea
              rows={8}
              name="description"
              id="description"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm">
                {formik.errors.description}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4 appearance-none focus:outline-1"
              value={formik.values.category}
              onChange={formik.handleChange}
            >
              <option value="" className="text-[#F7FBFF]" disabled>
                Choose a category
              </option>
              {categories &&
                categories.map((category: ICategory) => {
                  return (
                    <option value={category.label} key={category.id}>
                      {category.label.toLocaleUpperCase()}
                    </option>
                  );
                })}
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-sm">
                {formik.errors.category}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="location">Location</label>
            <select
              name="location"
              id="location"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4 appearance-none focus:outline-1"
              value={formik.values.location}
              onChange={formik.handleChange}
            >
              <option value="" className="text-[#F7FBFF]" disabled>
                Choose a location
              </option>
              {locations &&
                locations.map((location: ILocation) => {
                  return (
                    <option value={location.label} key={location.id}>
                      {location.label.toLocaleUpperCase()}
                    </option>
                  );
                })}
            </select>
            {formik.touched.location && formik.errors.location && (
              <div className="text-red-500 text-sm">
                {formik.errors.location}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="start_date">Start Date</label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              value={formik.values.start_date}
              onChange={formik.handleChange}
            />
            {formik.touched.start_date && formik.errors.start_date && (
              <div className="text-red-500 text-sm">
                {formik.errors.start_date}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="end_date">End Date</label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              value={formik.values.end_date}
              onChange={formik.handleChange}
            />
            {formik.touched.end_date && formik.errors.end_date && (
              <div className="text-red-500 text-sm">
                {formik.errors.end_date}
              </div>
            )}
          </div>

          <button className="text-white bg-[#162D3A] p-4 rounded-[12px]">
            Add Event
          </button>
        </form>

        <center>
          <Link href={'/dashboard'} className="text-[#1E4AE9]">
            Cancel
          </Link>
          <Toaster richColors className=""></Toaster>
        </center>
      </div>
    </div>
  );
}
