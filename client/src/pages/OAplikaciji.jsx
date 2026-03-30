import { Link } from 'react-router-dom';

const sekcije = [
  {
    id: 'pocetak',
    naslov: 'Kako početi',
    tekst:
      'Na početnoj stranici izaberite „Novi projekat“, unesite osnovne podatke o objektu (površina, tip, vrsta radova) i sačuvajte. Posle toga otvara se stranica projekta sa checklistom prilagođenom vašem tipu gradnje.',
    link: { to: '/novi-projekat', label: 'Kreiraj projekat' },
  },
  {
    id: 'checklist',
    naslov: 'Checklist',
    tekst:
      'Projekat je podeljen na faze i dokumente. Označite šta je završeno, pratite procenat napretka i menjajte status pojedinačnih stavki. Tako uvek znate šta još treba da pripremite pre sledećeg koraka.',
    link: { to: '/', label: 'Moji projekti' },
  },
  {
    id: 'institucije',
    naslov: 'Institucije',
    tekst:
      'Pregledajte državne organe i institucije relevantne za gradnju: kategorije, kratki opisi i direktni linkovi ka zvaničnim sajtovima. Koristite ovo kada treba da podnesete zahtev ili proverite procedure.',
    link: { to: '/institucije', label: 'Institucije' },
  },
  {
    id: 'kalkulator',
    naslov: 'Kalkulator',
    tekst:
      'Unesite parametre objekta da biste dobili indikativnu procenu troškova (projektovanje, doprinosi, takse, komunalije i slično). Rezultat je orijentacion — služi za planiranje budžeta, ne kao obavezujuća ponuda.',
    link: { to: '/kalkulator', label: 'Otvori kalkulator' },
  },
  {
    id: 'ai',
    naslov: 'AI asistent',
    tekst:
      'Postavljajte pitanja o gradnji, dozvolama i procedurama u Srbiji. Asistent koristi veštačku inteligenciju usmerenu na građevinsku tematiku; proveravajte važne informacije i kod advokata ili u institucijama.',
    link: { to: '/ai', label: 'AI asistent' },
  },
  {
    id: 'upload',
    naslov: 'Upload dokumenata',
    tekst:
      'U okviru checkliste, kod svakog dokumenta možete da priložite fajlove (npr. PDF ili slike). Fajlovi se čuvaju bezbedno; pojedinačne priloge možete ukloniti ako ste pogrešili ili zamenili dokument.',
    link: null,
  },
];

export default function OAplikaciji() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-purple-50/40 min-h-screen py-8 px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <p className="text-purple-600 text-sm font-semibold tracking-wide uppercase mb-2">
            Uputstvo
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            O aplikaciji
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            <span className="text-purple-700 font-medium">Dobrodošli u Planer Izgradnje</span> —
            alat za planiranje i praćenje vašeg gradilišta. Na jednom mestu imate checklistu faza,
            pristup relevantnim institucijama, procenu troškova, AI pomoć i mesto za vaše dokumente.
          </p>
        </header>

        <div className="space-y-5">
          {sekcije.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-purple-900/5 overflow-hidden"
            >
              <div className="border-l-4 border-purple-500 pl-5 pr-5 py-5 sm:pl-6 sm:pr-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-sm font-bold"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  {s.naslov}
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">{s.tekst}</p>
                {s.link && (
                  <div className="mt-4">
                    <Link
                      to={s.link.to}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-700 hover:text-purple-900 underline decoration-purple-300 underline-offset-4 hover:decoration-purple-500 transition-colors"
                    >
                      {s.link.label}
                      <span aria-hidden className="text-purple-500">
                        →
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Za pitanja o nalogu i prijavi koristite dugme profila u gornjem desnom uglu.
        </p>
      </div>
    </div>
  );
}
