'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  const excludedRoutes = [
    '/sign-in',
    '/sign-up',
    '/dashboard/events/new',
    '/my-tickets',
  ];

  const isExcludedDynamicRoute =
    (pathname.startsWith('/dashboard/events/') &&
      (pathname.endsWith('/edit') ||
        pathname.endsWith('/new') ||
        pathname.includes('/reviews'))) ||
    pathname.startsWith('/my-tickets/payment/') ||
    pathname.startsWith('/my-tickets/review/');

  const hideNavbar =
    excludedRoutes.includes(pathname) || isExcludedDynamicRoute;

  if (hideNavbar) return null;

  return <Navbar />;
}
