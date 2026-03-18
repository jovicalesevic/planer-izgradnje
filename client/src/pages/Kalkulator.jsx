import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const STAVKE = [
  { naziv: 'Projektovanje', iznos: (p) => p * 25 },
  { naziv: 'Doprinos za uređenje', iznos: (p) => p * 18 },
  { naziv: 'Taksa za građevinsku dozvolu', iznos: (p) => p * 2.5 },
  { naziv: 'Komunalni priključci', iznos: () => 2800 },
  { naziv: 'Geodetski elaborat i uknjižba', iznos: () => 600 },
];

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

export default function Kalkulator() {
  const navigate = useNavigate();
  const [povrsinaGradjevinem2, setPovrsinaGradjevinem2] = useState(100);
  const [tipObjekta, setTipObjekta] = useState('stambeni');
  const [vrstaRadova, setVrstaRadova] = useState('nova_gradnja');

  const { stavke, ukupno } = useMemo(() => {
    const s = STAVKE.map((st) => ({
      naziv: st.naziv,
      iznosEur: st.iznos(povrsinaGradjevinem2),
    }));
    const u = s.reduce((acc, st) => acc + st.iznosEur, 0);
    return { stavke: s, ukupno: u };
  }, [povrsinaGradjevinem2]);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Kalkulator troškova</h1>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Nazad
        </button>
      </div>

      <form style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
            Površina građevine (m²)
          </label>
          <input
            type="number"
            min={1}
            value={povrsinaGradjevinem2}
            onChange={(e) => setPovrsinaGradjevinem2(Number(e.target.value) || 0)}
            style={{ padding: '8px 12px', fontSize: 14, width: '100%', maxWidth: 200, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
            Tip objekta
          </label>
          <select
            value={tipObjekta}
            onChange={(e) => setTipObjekta(e.target.value)}
            style={{ padding: '8px 12px', fontSize: 14, width: '100%', maxWidth: 200 }}
          >
            {TIP_OBJEKTA_OPCIJE.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
            Vrsta radova
          </label>
          <select
            value={vrstaRadova}
            onChange={(e) => setVrstaRadova(e.target.value)}
            style={{ padding: '8px 12px', fontSize: 14, width: '100%', maxWidth: 200 }}
          >
            {VRSTA_RADOVA_OPCIJE.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14 }}>Stavka</th>
            <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: 14 }}>Iznos (EUR)</th>
          </tr>
        </thead>
        <tbody>
          {stavke.map((st) => (
            <tr key={st.naziv} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontSize: 14 }}>{st.naziv}</td>
              <td style={{ padding: '12px 8px', fontSize: 14, textAlign: 'right' }}>
                {st.iznosEur.toLocaleString('sr-RS', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: '12px 8px', fontSize: 16, fontWeight: 600, borderTop: '2px solid #e5e7eb' }}>
        Ukupno: {ukupno.toLocaleString('sr-RS', { minimumFractionDigits: 2 })} EUR
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: '#6b7280' }}>
        Napomena: Iznosi su indikativni i mogu varirati u zavisnosti od opštine, tipa objekta i drugih faktora.
      </p>
    </div>
  );
}
