import { Link, useLocation } from 'react-router-dom';

const LINKOVI = [
  { naziv: 'Projekti', putanja: '/' },
  { naziv: 'Institucije', putanja: '/institucije' },
  { naziv: 'Kalkulator', putanja: '/kalkulator' },
  { naziv: 'AI Asistent', putanja: '/ai' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      backgroundColor: '#111827',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span style={{ color: '#f9fafb', fontWeight: '700', fontSize: '18px', letterSpacing: '0.3px' }}>
        Planer Izgradnje
      </span>

      <div style={{ display: 'flex', gap: '4px' }}>
        {LINKOVI.map(({ naziv, putanja }) => {
          const aktivan = pathname === putanja;
          return (
            <Link
              key={putanja}
              to={putanja}
              style={{
                color: aktivan ? '#60a5fa' : '#d1d5db',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: aktivan ? '600' : '400',
                backgroundColor: aktivan ? 'rgba(96,165,250,0.12)' : 'transparent',
                transition: 'color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!aktivan) {
                  e.currentTarget.style.color = '#f9fafb';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                }
              }}
              onMouseLeave={(e) => {
                if (!aktivan) {
                  e.currentTarget.style.color = '#d1d5db';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {naziv}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
