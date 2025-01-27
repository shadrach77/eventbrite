'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  const excludedRoutes = ['/sign-in', '/sign-up'];

  const hideNavbar = excludedRoutes.includes(pathname);

  if (hideNavbar) return null;

  return <Navbar />;
}
