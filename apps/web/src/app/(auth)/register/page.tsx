'use client';

import React from 'react';
import { useFormik } from 'formik';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  full_name: Yup.string().required('Please enter a valid name'),
});

export default function Page() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      full_name: '',
      role: 'CUSTOMER',
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
              email: values.email,
              password: values.password,
              full_name: values.full_name,
              role: values.role,
            }),
          },
        );

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
  return (
    <div className="w-full max-w-96 flex flex-col gap-12">
      <div>
        <h1 className=" font-semibold text-3xl">Welcome Back</h1>
        <p className="mt-4">
          {`Today is a new day. It's your day. You shape it. Sign in to start
          managing your projects.`}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id=""
            className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
            placeholder="Example@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Full Name</label>
          <input
            type="text"
            name="full_name"
            id=""
            className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
            placeholder="John Doe"
            value={formik.values.full_name}
            onChange={formik.handleChange}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id=""
              className="bg-[#F7FBFF] w-full rounded-[12px] border border-[#D4D7E3] p-4"
              placeholder="* * * * * * * * * *"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role">Role</label>
            <div className="flex items-center gap-6">
              <div>
                <input
                  type="radio"
                  id="customer"
                  name="role"
                  value="CUSTOMER"
                  checked={formik.values.role === 'CUSTOMER'}
                  onChange={formik.handleChange}
                />
                <label htmlFor="customer" className="ml-2">
                  Customer
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="organizer"
                  name="role"
                  value="ORGANIZER"
                  checked={formik.values.role === 'ORGANIZER'}
                  onChange={formik.handleChange}
                />
                <label htmlFor="organizer" className="ml-2">
                  Organizer
                </label>
              </div>
            </div>
          </div>

          <button className="text-white bg-[#162D3A] p-4 rounded-[12px]">
            Register
          </button>
        </div>
      </form>

      <center>
        {`Already have an account? `}

        <Link href={'/login'} className="text-[#1E4AE9]">
          Log In
        </Link>

        <Toaster richColors className=""></Toaster>
      </center>
    </div>
  );
}
