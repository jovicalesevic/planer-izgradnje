import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/index.js';

const KATEGORIJE = [
  { value: '', label: '— Izaberi kategoriju —' },
  { value: 'katastar', label: 'Katastar' },
  { value: 'urbanizam', label: 'Urbanizam' },
  { value: 'gradjevinska_dozvola', label: 'Građevinska dozvola' },
  { value: 'komunalije', label: 'Komunalije' },
  { value: 'inspekcija', label: 'Inspekcija' },
  { value: 'finansije', label: 'Finansije' },
  { value: 'ostalo', label: 'Ostalo' },
];

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white';
const labelClass = 'block text-sm text-gray-600 mb-1';

function parseRelevantneFaze(str) {
  if (!str || !String(str).trim()) return [];
  return String(str)
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 6);
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { getAdminInstitucije, createAdminInstitucija, deleteAdminInstitucija } = useApi();

  const [institucije, setInstitucije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    naziv: '',
    skracenica: '',
    kategorija: '',
    opis: '',
    url: '',
    relevantneFazeStr: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAdminInstitucije()
      .then((data) => {
        if (!cancelled) setInstitucije(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        naziv: form.naziv.trim(),
        skracenica: form.skracenica.trim() || undefined,
        kategorija: form.kategorija || undefined,
        opis: form.opis.trim() || undefined,
        url: form.url.trim() || undefined,
        relevantneFaze: parseRelevantneFaze(form.relevantneFazeStr),
      };
      if (!payload.naziv) {
        setError('Naziv je obavezan.');
        return;
      }
      await createAdminInstitucija(payload);
      setForm({
        naziv: '',
        skracenica: '',
        kategorija: '',
        opis: '',
        url: '',
        relevantneFazeStr: '',
      });
      const data = await getAdminInstitucije();
      setInstitucije(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati instituciju?')) return;
    setError(null);
    try {
      await deleteAdminInstitucija(id);
      setInstitucije((prev) => prev.filter((x) => String(x._id) !== String(id)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <p className="text-gray-500 text-sm">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Admin — institucije</h1>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="border border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer"
          >
            ← Nazad
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Nova institucija</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="naziv">Naziv *</label>
              <input
                id="naziv"
                name="naziv"
                value={form.naziv}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="skracenica">Skraćenica</label>
                <input
                  id="skracenica"
                  name="skracenica"
                  value={form.skracenica}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="kategorija">Kategorija</label>
                <select
                  id="kategorija"
                  name="kategorija"
                  value={form.kategorija}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {KATEGORIJE.map((o) => (
                    <option key={o.value || 'empty'} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="opis">Opis</label>
              <textarea
                id="opis"
                name="opis"
                value={form.opis}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="url">URL</label>
              <input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="relevantneFazeStr">Relevantne faze</label>
              <input
                id="relevantneFazeStr"
                name="relevantneFazeStr"
                value={form.relevantneFazeStr}
                onChange={handleChange}
                placeholder="npr. 1, 2, 3"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Brojevi faza (1–6), odvojeni zarezom.</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
            >
              {submitting ? 'Čuvanje...' : 'Dodaj instituciju'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <h2 className="text-lg font-medium text-gray-800 px-6 py-4 border-b border-gray-100">
            Lista institucija ({institucije.length})
          </h2>
          <ul className="divide-y divide-gray-100">
            {institucije.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500 text-sm">Nema institucija.</li>
            ) : (
              institucije.map((inst) => (
                <li
                  key={inst._id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{inst.naziv}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {inst.kategorija && <span className="mr-2">{inst.kategorija}</span>}
                      {inst.skracenica && <span>{inst.skracenica}</span>}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(inst._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium self-start sm:self-center transition-colors duration-150 cursor-pointer shrink-0"
                  >
                    Obriši
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
