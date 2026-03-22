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

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white';

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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Kalkulator troškova</h1>
          <button
            onClick={() => navigate('/')}
            className="border border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer"
          >
            ← Nazad
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <form>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Površina građevine (m²)</label>
                <input
                  type="number"
                  min={1}
                  value={povrsinaGradjevinem2}
                  onChange={(e) => setPovrsinaGradjevinem2(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tip objekta</label>
                <select
                  value={tipObjekta}
                  onChange={(e) => setTipObjekta(e.target.value)}
                  className={inputClass}
                >
                  {TIP_OBJEKTA_OPCIJE.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vrsta radova</label>
                <select
                  value={vrstaRadova}
                  onChange={(e) => setVrstaRadova(e.target.value)}
                  className={inputClass}
                >
                  {VRSTA_RADOVA_OPCIJE.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Stavka</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Iznos (EUR)</th>
              </tr>
            </thead>
            <tbody>
              {stavke.map((st) => (
                <tr key={st.naziv} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{st.naziv}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-right tabular-nums">
                    {st.iznosEur.toLocaleString('sr-RS', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between mb-6">
          <span className="text-purple-700 font-semibold text-xl">Ukupno</span>
          <span className="text-purple-700 font-semibold text-xl tabular-nums">
            {ukupno.toLocaleString('sr-RS', { minimumFractionDigits: 2 })} EUR
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Napomena: Iznosi su indikativni i mogu varirati u zavisnosti od opštine, tipa objekta i drugih faktora.
        </p>
      </div>
    </div>
  );
}
