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
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <nav className="bg-gray-900 sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
      <div className="max-w-4xl mx-auto w-full px-3 sm:px-6">
        <div className="flex items-center justify-between h-12 border-b border-white/10">
          <span className="text-white font-bold text-base tracking-tight truncate pr-2">
            Planer Izgradnje
          </span>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>

        <div className="flex flex-wrap justify-around gap-y-1 py-1 -mx-1 sm:mx-0">
        {LINKOVI.map(({ naziv, putanja }) => {
          const aktivan = pathname === putanja;
          return (
            <Link
              key={putanja}
              to={putanja}
              className={`flex-1 text-center text-sm px-2 py-2 transition-colors duration-150 min-w-[80px] ${
                aktivan
                  ? 'text-purple-400 font-semibold border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {naziv}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            to="/admin"
            className={`flex-1 text-center text-sm px-2 py-2 transition-colors duration-150 min-w-[80px] ${
              pathname === '/admin'
                ? 'text-red-400 font-semibold border-b-2 border-red-400'
                : 'text-red-500 hover:text-red-400'
            }`}
          >
            Admin
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
}
