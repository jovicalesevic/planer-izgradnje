import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjekti } from '../api/index.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjekti()
      .then(setProjekti)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatTip = (tip) => tip?.replace(/_/g, ' ') || '—';
  const formatVrsta = (vrsta) => vrsta?.replace(/_/g, ' ') || '—';

  if (loading) {
    return <div style={{ padding: 24, fontSize: 16 }}>Učitavanje...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: '#c00', fontSize: 16 }}>
        Greška: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 12px 0', fontSize: 24 }}>Moji projekti</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'flex-start' }}>
        <button
          onClick={() => navigate('/novi-projekat')}
          style={{
            padding: '5px 10px',
            fontSize: 13,
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Novi projekat
        </button>
      </div>

      {projekti.length === 0 ? (
        <p style={{ fontSize: 16, color: '#666' }}>Nemate još uvek nijedan projekat.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {projekti.map((p) => (
            <li
              key={p._id}
              onClick={() => navigate(`/projekat/${p._id}`)}
              style={{
                padding: 16,
                marginBottom: 12,
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{p.naziv}</div>
              <div style={{ fontSize: 14, color: '#666' }}>
                <span style={{ marginRight: 16 }}>Tip: {formatTip(p.tipObjekta)}</span>
                <span style={{ marginRight: 16 }}>Vrsta radova: {formatVrsta(p.vrstaRadova)}</span>
                <span>Status: {p.status || '—'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
