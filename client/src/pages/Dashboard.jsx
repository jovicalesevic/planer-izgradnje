import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/index.js';

const STATUS_PROGRESS = {
  'planiranje': 10,
  'u toku': 50,
  'završen': 100,
  'pauziran': 30,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { getProjekti } = useApi();
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

  const getProgress = (status) =>
    STATUS_PROGRESS[status?.toLowerCase()] ?? 0;

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
              const progress = getProgress(p.status);
              return (
                <li
                  key={p._id}
                  onClick={() => navigate(`/projekat/${p._id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all duration-150"
                >
                  <div className="font-bold text-gray-900 text-base mb-1">{p.naziv}</div>
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
