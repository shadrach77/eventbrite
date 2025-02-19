'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/helpers/api';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

interface ICategory {
  id: string;
  label: string;
}

interface ILocation {
  id: string;
  label: string;
}

interface ICurrFormData {
  id: string;
  organizer_id: string;
  category_id: string;
  location_id: string;
  title: string;
  start_date: any;
  end_date: any;
  description: string;
  rating?: string;
  picture?: string;
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
    .test(
      'is-today-or-after',
      'Start date must be today or anytime after today',
      function (value) {
        if (!value) return false;

        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0); // Normalize time to start of the day

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize current date

        return selectedDate >= today;
      },
    ),
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
  picture: Yup.string().nullable().optional(),
});

function Page({ params: { id } }: Props) {
  const { data: session } = useSession();
  const [currFormData, setCurrFormData] = useState<ICurrFormData | null>(null);
  const [currEventPictureLink, setCurrEventPictureLink] = useState('');
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFormData() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/my-events/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.authentication_token}`,
            },
          },
        );

        if (!response.ok) {
          console.log('Error fetching data:', response.statusText);
          return;
        }

        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          console.log('currFormData =>', data.data);
          setCurrFormData(data.data);
          setCurrEventPictureLink(data.data.picture);
        } else {
          console.error('Unexpected response format:', await response.text());
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    if (session) {
      getFormData();
    }
  }, [session, id]);

  //formik

  const formik = useFormik({
    initialValues: {
      title: currFormData?.title,
      category: currFormData?.category_id,
      location: currFormData?.location_id,
      start_date: currFormData?.start_date
        ? new Date(currFormData.start_date).toISOString().split('T')[0]
        : '',
      end_date: currFormData?.end_date
        ? new Date(currFormData.end_date).toISOString().split('T')[0]
        : '',
      description: currFormData?.description,
      picture: currFormData?.picture,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const deleteEventPicture = async (): Promise<string | void> => {
        if (values.picture && currEventPictureLink) {
          try {
            const response: any = await fetch(
              'http://localhost:8000/api/events/my-event-picture',
              {
                method: 'DELETE',
                body: JSON.stringify({
                  link: String(currEventPictureLink),
                }),
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session?.user.authentication_token}`,
                },
              },
            );

            const data = await response.json();

            if (response.ok) {
              toast.success(data.message || 'Picture successfully deleted!');
              return data.data;
            } else {
              toast.error(data.message || 'Something went wrong!');
              return;
            }
          } catch (error) {
            console.error(error);
            toast.error('Network error. Please try again later.');
            return;
          }
        } else {
          return;
        }
      };

      const uploadEventPicture = async (): Promise<string | void> => {
        if (!values.picture) return;

        const formData = new FormData();

        if (values.picture) {
          formData.append('picture', values.picture);
        }
        try {
          const response: any = await fetch(
            'http://localhost:8000/api/events/my-event-picture',
            {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${session?.user.authentication_token}`,
              },
            },
          );

          const data = await response.json();

          if (response.ok) {
            toast.success(data.message || 'Picture successfully uploaded!');
            return data.data;
          } else {
            toast.error(data.message || 'Something went wrong!');
            return;
          }
        } catch (error) {
          console.error(error);
          toast.error('Network error. Please try again later.');
          return;
        }
      };

      const updateEvent = async (pictureUrl: string | void) => {
        try {
          const response: any = await fetch(
            `http://localhost:8000/api/events/my-events/${id}`,
            {
              method: 'PATCH',
              body: JSON.stringify({
                id: currFormData?.id,
                title: values.title,
                category_id: values.category,
                location_id: values.location,
                start_date: values.start_date,
                end_date: values.end_date,
                description: values.description,
                picture: values.picture
                  ? pictureUrl
                  : currEventPictureLink
                    ? currEventPictureLink
                    : null,
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user.authentication_token}`,
              },
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
          // })

          const data = await response.json();

          if (response.ok) {
            toast.success(
              data.message ||
                'Event successfully created! Redirecting you soon...',
            );
          } else {
            toast.error(data.message || 'Something went wrong!');
          }
        } catch (error) {
          console.error(error);
          toast.error('Network error. Please try again later.');
        }
      };

      try {
        setDisabled(true);
        await deleteEventPicture();
        const pictureUrl = await uploadEventPicture();
        await updateEvent(pictureUrl);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        setDisabled(false);
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
          <h1 className=" font-semibold text-3xl">Edit An Event</h1>
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
                    <option value={category.id} key={category.id}>
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
                    <option value={location.id} key={location.id}>
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

          <div className="flex flex-col gap-2">
            <label htmlFor="picture">Change Event Picture</label>
            <input
              type="file"
              id="picture"
              name="picture"
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  formik.setFieldValue('picture', file);
                }
              }}
            />
            {formik.touched.picture && formik.errors.picture && (
              <div className="text-red-500 text-sm">
                {formik.errors.picture}
              </div>
            )}
          </div>

          <button
            className={
              disabled
                ? 'text-white bg-[#963232] p-4 rounded-[12px]'
                : 'text-white bg-[#162D3A] p-4 rounded-[12px]'
            }
            disabled={disabled}
          >
            {disabled ? 'Updating Event' : 'Update Event'}
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

export default Page;
