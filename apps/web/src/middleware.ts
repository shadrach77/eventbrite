'use client';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (session?.user) {
    if (
      req.nextUrl.pathname === '/sign-up' ||
      req.nextUrl.pathname === '/sign-in'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (!session?.user) {
    if (req.nextUrl.pathname.includes('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (req.nextUrl.pathname.includes('/my-tickets')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (session?.user.role === 'ORGANIZER') {
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (req.nextUrl.pathname.includes('/my-tickets')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  if (session?.user.role === 'CUSTOMER') {
    if (req.nextUrl.pathname.includes('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}
