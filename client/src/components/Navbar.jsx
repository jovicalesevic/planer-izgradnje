import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/react';

const LINKOVI = [
  { naziv: 'Projekti', putanja: '/' },
  { naziv: 'Institucije', putanja: '/institucije' },
  { naziv: 'Kalkulator', putanja: '/kalkulator' },
  { naziv: 'AI Asistent', putanja: '/ai' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useUser();

  return (
    <nav className="bg-gray-900 sticky top-0 z-50 h-16 px-6 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
      <span className="text-white font-bold text-lg tracking-tight">
        Planer Izgradnje
      </span>

      <div className="flex gap-1">
        {LINKOVI.map(({ naziv, putanja }) => {
          const aktivan = pathname === putanja;
          return (
            <Link
              key={putanja}
              to={putanja}
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                aktivan
                  ? 'text-purple-400 font-semibold bg-purple-400/10'
                  : 'text-gray-300 font-normal hover:text-white hover:bg-white/[0.07]'
              }`}
            >
              {naziv}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5">
        {user && (
          <span className="text-gray-300 text-sm">
            {user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress}
          </span>
        )}
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
  );
}
