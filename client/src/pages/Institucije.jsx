import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstitucije } from '../api/index.js';

export default function Institucije() {
  const navigate = useNavigate();
  const [institucije, setInstitucije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInstitucije()
      .then(setInstitucije)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ margin: 0 }}>Učitavanje...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: 'red', margin: 0 }}>{error}</p>
        <button onClick={() => navigate('/')} style={{ marginTop: 10, padding: '8px 16px', cursor: 'pointer' }}>
          Nazad
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Institucije</h1>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Nazad
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {institucije.map((inst) => (
          <div
            key={inst._id}
            style={{
              padding: 16,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{inst.naziv || '—'}</h3>
            {inst.opis && (
              <p style={{ margin: 0, fontSize: 14, color: '#555', lineHeight: 1.4 }}>{inst.opis}</p>
            )}
            {inst.url && (
              <a
                href={inst.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none' }}
              >
                {inst.url}
              </a>
            )}
            {inst.relevantneFaze && inst.relevantneFaze.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {inst.relevantneFaze.map((f) => (
                  <span
                    key={f}
                    style={{
                      padding: '4px 8px',
                      fontSize: 12,
                      backgroundColor: '#e5e7eb',
                      borderRadius: 4,
                      color: '#374151',
                    }}
                  >
                    Faza {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {institucije.length === 0 && (
        <p style={{ color: '#666', margin: 0 }}>Nema institucija.</p>
      )}
    </div>
  );
}
