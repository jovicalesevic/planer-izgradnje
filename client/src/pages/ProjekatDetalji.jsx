import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../api/index.js';

export default function ProjekatDetalji() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjekat, getChecklist, createChecklist, updateDokument } = useApi();

  const [projekat, setProjekat] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFazaId, setExpandedFazaId] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProjekat(id)
      .then((p) => {
        if (!cancelled) setProjekat(p);
        return getChecklist(id);
      })
      .then((data) => {
        if (!cancelled) setChecklist(data ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.message?.includes('404') || err.message?.includes('Checklist nije pronađen')) {
            setChecklist(null);
          } else {
            setError(err.message);
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const handleKreirajChecklist = async () => {
    try {
      const data = await createChecklist(id, []);
      setChecklist(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFaza = (fazaId) => {
    setExpandedFazaId((prev) => (prev === fazaId ? null : fazaId));
  };

  const handleCheckboxChange = async (fazaId, dokumentId, dok) => {
    try {
      const noviStatus = dok.status === 'zavrseno' ? 'ceka' : 'zavrseno';
      const data = await updateDokument(id, fazaId, dokumentId, { status: noviStatus });
      setChecklist(data);
    } catch (err) {
      setError(err.message);
    }
  };

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
        <button onClick={() => navigate('/')} style={{ marginTop: 10, padding: '8px 16px' }}>
          Nazad
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>{projekat?.naziv || 'Projekat'}</h2>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Nazad
        </button>
      </div>

      {!checklist ? (
        <div>
          <p style={{ marginBottom: 12 }}>Checklist za ovaj projekat ne postoji.</p>
          <button
            onClick={handleKreirajChecklist}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4 }}
          >
            Kreiraj checklist
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ margin: '0 0 12px 0' }}>Faze</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {(checklist.faze || []).map((faza) => (
              <li key={faza._id} style={{ marginBottom: 8, border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  onClick={() => toggleFaza(faza._id)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: expandedFazaId === faza._id ? '#f0f0f0' : '#fff',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{faza.naziv || `Faza ${faza.brojFaze}`}</span>
                  <span style={{ marginLeft: 8, color: '#666', fontSize: 14 }}>
                    ({faza.status || '—'})
                  </span>
                </div>
                {expandedFazaId === faza._id && (
                  <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderTop: '1px solid #eee' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>Dokumenti</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {(faza.dokumenti || []).map((dok) => (
                        <li
                          key={dok._id}
                          style={{
                            padding: '8px 0',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={dok.status === 'zavrseno'}
                            onChange={() => handleCheckboxChange(faza._id, dok._id, dok)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ textDecoration: dok.status === 'zavrseno' ? 'line-through' : 'none', flex: 1 }}>
                            {dok.naziv || 'Bez naziva'}
                          </span>
                          <span style={{ color: '#666', fontSize: 13 }}>{dok.status || '—'}</span>
                        </li>
                      ))}
                      {(!faza.dokumenti || faza.dokumenti.length === 0) && (
                        <li style={{ color: '#999', padding: 8 }}>Nema dokumenata</li>
                      )}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {(!checklist.faze || checklist.faze.length === 0) && (
            <p style={{ color: '#999', margin: 12 }}>Nema faza u checklistu.</p>
          )}
        </div>
      )}
    </div>
  );
}
