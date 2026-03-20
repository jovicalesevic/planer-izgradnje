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

  const inputStyle = {
    width: '100%',
    padding: 10,
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    marginBottom: 12,
  };
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 };

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24, fontSize: 24 }}>Novi projekat</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle} htmlFor="naziv">Naziv *</label>
          <input
            id="naziv"
            name="naziv"
            type="text"
            value={formData.naziv}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle} htmlFor="tipObjekta">Tip objekta</label>
          <select
            id="tipObjekta"
            name="tipObjekta"
            value={formData.tipObjekta}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">— Izaberi —</option>
            {TIP_OBJEKTA_OPCIJE.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle} htmlFor="vrstaRadova">Vrsta radova</label>
          <select
            id="vrstaRadova"
            name="vrstaRadova"
            value={formData.vrstaRadova}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">— Izaberi —</option>
            {VRSTA_RADOVA_OPCIJE.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle} htmlFor="opstina">Opština</label>
          <input
            id="opstina"
            name="lokacija.opstina"
            type="text"
            value={formData.lokacija.opstina}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle} htmlFor="povrsinaGradjevinem2">Površina građevine (m²)</label>
          <input
            id="povrsinaGradjevinem2"
            name="povrsinaGradjevinem2"
            type="number"
            min="0"
            step="0.01"
            value={formData.povrsinaGradjevinem2}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle} htmlFor="napomene">Napomene</label>
          <textarea
            id="napomene"
            name="napomene"
            value={formData.napomene}
            onChange={handleChange}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        {error && (
          <div style={{ color: '#c00', marginBottom: 16, fontSize: 14 }}>{error}</div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Čuvanje...' : 'Sačuvaj'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Otkaži
          </button>
        </div>
      </form>
    </div>
  );
}
