import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../api/index.js';

const STATUS_BADGE = {
  aktivna:    'bg-purple-100 text-purple-700',
  zavrsena:   'bg-green-100 text-green-700',
  zakljucana: 'bg-gray-100 text-gray-500',
};

function StatusBadge({ status }) {
  const klasa = STATUS_BADGE[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${klasa}`}>
      {status || '—'}
    </span>
  );
}

export default function ProjekatDetalji() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjekat, getChecklist, createChecklist, updateDokument, uploadDokument } = useApi();

  const [projekat, setProjekat] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFazaId, setExpandedFazaId] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);

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

  const handlePrilogOdabran = async (e, fazaId, dokumentId) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const key = `${fazaId}-${dokumentId}`;
    setUploadingFor(key);
    setError(null);
    try {
      await uploadDokument(id, fazaId, dokumentId, file);
      const data = await getChecklist(id);
      setChecklist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingFor(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Učitavanje...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer"
        >
          Nazad
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{projekat?.naziv || 'Projekat'}</h1>
          <button
            onClick={() => navigate('/')}
            className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer"
          >
            ← Nazad
          </button>
        </div>

        {!checklist ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-gray-600 text-sm mb-4">Checklist za ovaj projekat ne postoji.</p>
            <button
              onClick={handleKreirajChecklist}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
            >
              Kreiraj checklist
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-base font-medium text-gray-700 mb-3">Faze</h2>

            {(!checklist.faze || checklist.faze.length === 0) ? (
              <p className="text-gray-400 text-sm">Nema faza u checklistu.</p>
            ) : (
              <ul className="space-y-3">
                {checklist.faze.map((faza) => {
                  const otvoren = expandedFazaId === faza._id;
                  return (
                    <li key={faza._id} className="bg-white rounded-xl border border-gray-200 shadow-sm mb-3 overflow-hidden">
                      <div
                        onClick={() => toggleFaza(faza._id)}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-150 ${otvoren ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">
                            {faza.naziv || `Faza ${faza.brojFaze}`}
                          </span>
                          <StatusBadge status={faza.status} />
                        </div>
                        <span className="text-gray-400 text-sm">{otvoren ? '▲' : '▼'}</span>
                      </div>

                      {otvoren && (
                        <div className="border-t border-gray-100 px-4 py-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Dokumenti</p>
                          {(!faza.dokumenti || faza.dokumenti.length === 0) ? (
                            <p className="text-gray-400 text-sm py-2">Nema dokumenata</p>
                          ) : (
                            <ul className="divide-y divide-gray-100">
                              {faza.dokumenti.map((dok) => {
                                const zavrsen = dok.status === 'zavrseno';
                                const inputId = `prilog-${faza._id}-${dok._id}`;
                                const uploadKey = `${faza._id}-${dok._id}`;
                                const uploaduje = uploadingFor === uploadKey;
                                const prviPrilogUrl = dok.fajlovi?.[0]?.url;
                                return (
                                  <li key={dok._id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5">
                                    <input
                                      type="checkbox"
                                      checked={zavrsen}
                                      onChange={() => handleCheckboxChange(faza._id, dok._id, dok)}
                                      className="accent-purple-600 w-4 h-4 cursor-pointer shrink-0"
                                    />
                                    <span className={`flex-1 min-w-[120px] text-sm ${zavrsen ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                      {dok.naziv || 'Bez naziva'}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {prviPrilogUrl && (
                                        <a
                                          href={prviPrilogUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-purple-600 hover:text-purple-700 underline font-medium"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          Prilog
                                        </a>
                                      )}
                                      <input
                                        id={inputId}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,image/*,application/pdf"
                                        className="hidden"
                                        disabled={uploaduje}
                                        onChange={(e) => handlePrilogOdabran(e, faza._id, dok._id)}
                                      />
                                      <button
                                        type="button"
                                        disabled={uploaduje}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          document.getElementById(inputId)?.click();
                                        }}
                                        className="text-sm text-gray-600 hover:text-purple-600 border border-gray-200 hover:border-purple-300 rounded-lg px-2.5 py-1 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                                      >
                                        {uploaduje ? 'Šaljem…' : 'Priloži'}
                                      </button>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-auto sm:ml-0">{dok.status || '—'}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
