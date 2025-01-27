'use client';

import React from 'react';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import * as Yup from 'yup';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
});

export default function Page() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        try {
          const response: any = await fetch(
            'http://localhost:8000/api/auth/profile',
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
              }),
            },
          );

          const data = await response.json();

          if (!response.ok) {
            toast.error(data.message || 'Something went wrong!');
          }
        } catch (error) {
          console.error(error);
          toast.error('Network error. Please try again later.');
        }

        const response = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
          redirectTo: '/',
        });

        if (response?.error) {
          toast.error('Email or Password is Incorrect');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="w-full max-w-96 flex flex-col gap-12">
      <div>
        <h1 className=" font-semibold text-3xl text-blue-200">Welcome Back</h1>
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
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
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
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-[#1E4AE9]">
              Forgot Password?
            </a>
          </div>

          <button className="text-white bg-[#162D3A] p-4 rounded-[12px]">
            Sign in
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4 text-[#294957]">
        <div className="flex p-[10px] justify-center items-center  gap-[10px]">
          <hr className="w-full h-[1px] bg-[#CFDFE2] border-0 " />
          Or
          <hr className="w-full h-[1px] bg-[#CFDFE2] border-0 " />
        </div>
      </div>

      <center>
        {`Don't have an account? `}

        <Link href={'/sign-up'} className="text-[#1E4AE9]">
          Sign Up
        </Link>
      </center>
      <Toaster richColors></Toaster>
    </div>
  );
}
