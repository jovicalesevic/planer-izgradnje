import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/index.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getProjekti, getNapredak, deleteProjekat } = useApi();
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const list = await getProjekti();
        if (cancelled) return;
        const enriched = await Promise.all(
          list.map(async (p) => {
            try {
              const n = await getNapredak(p._id);
              return { ...p, procenatNapredak: n.procenat };
            } catch {
              return { ...p, procenatNapredak: 0 };
            }
          })
        );
        if (!cancelled) setProjekti(enriched);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatTip = (tip) => tip?.replace(/_/g, ' ') || '—';
  const formatVrsta = (vrsta) => vrsta?.replace(/_/g, ' ') || '—';

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Da li ste sigurni da želite da obrišete projekat?')) return;
    try {
      await deleteProjekat(id);
      setProjekti((prev) => prev.filter((p) => String(p._id) !== String(id)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">Učitavanje...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-sm">Greška: {error}</div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Moji projekti</h1>
          <button
            onClick={() => navigate('/novi-projekat')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
          >
            + Novi projekat
          </button>
        </div>

        {projekti.length === 0 ? (
          <p className="text-gray-500 text-sm">Nemate još uvek nijedan projekat.</p>
        ) : (
          <ul className="space-y-3">
            {projekti.map((p) => {
              const progress = p.procenatNapredak ?? 0;
              return (
                <li
                  key={p._id}
                  onClick={() => navigate(`/projekat/${p._id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all duration-150"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-bold text-gray-900 text-base">{p.naziv}</div>
                    <button
                      onClick={(e) => handleDelete(e, p._id)}
                      className="text-red-500 hover:text-red-700 text-sm ml-3 shrink-0 transition-colors duration-150 cursor-pointer"
                      title="Obriši projekat"
                    >
                      Obriši
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-xs text-gray-500 mb-3">
                    <span>Tip: <span className="text-gray-700">{formatTip(p.tipObjekta)}</span></span>
                    <span>Vrsta radova: <span className="text-gray-700">{formatVrsta(p.vrstaRadova)}</span></span>
                    <span>Status: <span className="text-gray-700">{p.status || '—'}</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {progress > 0 && (
                    <div className="text-right text-xs text-gray-400 mt-0.5">{progress}%</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
