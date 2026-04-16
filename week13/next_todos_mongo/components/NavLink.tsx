'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

// NavLink applies active styles when the current URL matches href.
// The `exact` prop makes the match strict — useful for the root "/" route.
export default function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white text-blue-700 shadow-sm'
          : 'text-white border border-white/40 hover:border-white/80 hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  );
}
