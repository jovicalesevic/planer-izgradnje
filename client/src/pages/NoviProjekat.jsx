import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/index.js';

const TIP_OBJEKTA_OPCIJE = [
  { value: 'stambeni', label: 'Stambeni' },
  { value: 'pomocni', label: 'Pomoćni' },
  { value: 'ekonomski', label: 'Ekonomski' },
  { value: 'poslovni', label: 'Poslovni' },
];

const VRSTA_RADOVA_OPCIJE = [
  { value: 'nova_gradnja', label: 'Nova gradnja' },
  { value: 'rekonstrukcija', label: 'Rekonstrukcija' },
  { value: 'adaptacija', label: 'Adaptacija' },
  { value: 'investiciono_odrzavanje', label: 'Investiciono održavanje' },
  { value: 'tekuce_odrzavanje', label: 'Tekuće održavanje' },
  { value: 'dogradnja', label: 'Dogradnja' },
  { value: 'promena_namene', label: 'Promena namene' },
];

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white';
const labelClass = 'block text-sm text-gray-600 mb-1';

export default function NoviProjekat() {
  const navigate = useNavigate();
  const { createProjekat } = useApi();
  const [formData, setFormData] = useState({
    naziv: '',
    tipObjekta: '',
    vrstaRadova: '',
    lokacija: { opstina: '' },
    povrsinaGradjevinem2: '',
    napomene: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lokacija.opstina') {
      setFormData((prev) => ({
        ...prev,
        lokacija: { ...prev.lokacija, opstina: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        naziv: formData.naziv,
        tipObjekta: formData.tipObjekta || undefined,
        vrstaRadova: formData.vrstaRadova || undefined,
        lokacija: formData.lokacija.opstina ? { opstina: formData.lokacija.opstina } : undefined,
        povrsinaGradjevinem2: formData.povrsinaGradjevinem2 ? Number(formData.povrsinaGradjevinem2) : undefined,
        napomene: formData.napomene || undefined,
      };
      await createProjekat(payload);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Novi projekat</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="naziv">Naziv *</label>
            <input
              id="naziv"
              name="naziv"
              type="text"
              value={formData.naziv}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="tipObjekta">Tip objekta</label>
            <select
              id="tipObjekta"
              name="tipObjekta"
              value={formData.tipObjekta}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">— Izaberi —</option>
              {TIP_OBJEKTA_OPCIJE.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="vrstaRadova">Vrsta radova</label>
            <select
              id="vrstaRadova"
              name="vrstaRadova"
              value={formData.vrstaRadova}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">— Izaberi —</option>
              {VRSTA_RADOVA_OPCIJE.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="opstina">Opština</label>
            <input
              id="opstina"
              name="lokacija.opstina"
              type="text"
              value={formData.lokacija.opstina}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="povrsinaGradjevinem2">Površina građevine (m²)</label>
            <input
              id="povrsinaGradjevinem2"
              name="povrsinaGradjevinem2"
              type="number"
              min="0"
              step="0.01"
              value={formData.povrsinaGradjevinem2}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="napomene">Napomene</label>
            <textarea
              id="napomene"
              name="napomene"
              value={formData.napomene}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-vertical`}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
            >
              {loading ? 'Čuvanje...' : 'Sačuvaj'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
