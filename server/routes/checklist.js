const express = require('express');
const mongoose = require('mongoose');
const Checklist = require('../schemas/Checklist');
const Projekat = require('../schemas/Projekat');

const router = express.Router();

const doc = (naziv) => ({ naziv, status: 'ceka' });

/** Metapodaci za 6 faza (isti redosled za sve šablone) */
const FAZE_META = [
  { brojFaze: 1, naziv: 'Priprema i provera parcele', status: 'aktivna' },
  { brojFaze: 2, naziv: 'Idejno rešenje i lokacijski uslovi', status: 'zakljucana' },
  { brojFaze: 3, naziv: 'Glavni projekat i građevinska dozvola', status: 'zakljucana' },
  { brojFaze: 4, naziv: 'Gradnja', status: 'zakljucana' },
  { brojFaze: 5, naziv: 'Tehnički pregled i upotrebna dozvola', status: 'zakljucana' },
  { brojFaze: 6, naziv: 'Uknjižba', status: 'zakljucana' },
];

/**
 * Nizovi naziva dokumenata po fazama (indeks 0–5 = faza 1–6).
 * Za održavanje: faze bez dokumenata = prazan niz.
 */
const TEMPLATE_DOKUMENTI = {
  nova_gradnja: [
    [
      'List nepokretnosti',
      'Kopija plana parcele',
      'Informacija o lokaciji',
      'Izvod iz planske dokumentacije',
      'Dokaz o pravu na gradnju',
    ],
    [
      'Idejno rešenje',
      'Zahtev za lokacijske uslove (CEOP)',
      'Lokacijski uslovi',
      'Uslovi komunalnih preduzeća',
      'Dokaz o uplati taksi',
    ],
    [
      'Glavni arhitektonski projekat',
      'Projekat konstrukcije (statika)',
      'Projekat instalacija',
      'Elaborat geotehničkih istraživanja',
      'Energetski elaborat',
      'Zahtev za građevinsku dozvolu (CEOP)',
      'Rešenje o građevinskoj dozvoli',
      'Dokaz o uplati doprinosa za uređenje',
    ],
    [
      'Prijava radova (CEOP)',
      'Ugovor sa izvođačem radova',
      'Dnevnik građenja',
      'Atesti za ugrađene materijale',
      'Izveštaji nadzornog organa',
    ],
    [
      'Zahtev za tehnički pregled (CEOP)',
      'Projekat izvedenog stanja (as-built)',
      'Izveštaj komisije tehničkog pregleda',
      'Dokaz o plaćenim komunalnim priključcima',
      'Rešenje o upotrebnoj dozvoli',
    ],
    [
      'Elaborat geodetskih radova',
      'Zahtev za upis u katastar',
      'Rešenje RGZ o upisu objekta',
      'Novi list nepokretnosti',
    ],
  ],

  rekonstrukcija: [
    [
      'List nepokretnosti',
      'Kopija plana parcele',
      'Informacija o lokaciji',
      'Izvod iz planske dokumentacije',
      'Dokaz o pravu na gradnju',
      'Rešenje o rušenju',
    ],
    [
      'Idejno rešenje',
      'Zahtev za lokacijske uslove (CEOP)',
      'Lokacijski uslovi',
      'Uslovi komunalnih preduzeća',
      'Dokaz o uplati taksi',
    ],
    [
      'Glavni arhitektonski projekat',
      'Projekat konstrukcije (statika)',
      'Projekat instalacija',
      'Elaborat geotehničkih istraživanja',
      'Energetski elaborat',
      'Zahtev za dozvolu za rekonstrukciju',
      'Rešenje o građevinskoj dozvoli',
      'Dokaz o uplati doprinosa za uređenje',
    ],
    [
      'Prijava radova (CEOP)',
      'Ugovor sa izvođačem radova',
      'Dnevnik građenja',
      'Atesti za ugrađene materijale',
      'Izveštaji nadzornog organa',
    ],
    [
      'Zahtev za tehnički pregled (CEOP)',
      'Projekat izvedenog stanja (as-built)',
      'Izveštaj komisije tehničkog pregleda',
      'Dokaz o plaćenim komunalnim priključcima',
      'Rešenje o upotrebnoj dozvoli',
    ],
    [
      'Elaborat geodetskih radova',
      'Zahtev za upis u katastar',
      'Rešenje RGZ o upisu objekta',
      'Novi list nepokretnosti',
    ],
  ],

  /** Faze 4–6 skraćene (adaptacija — uknjižba nije uvek potpuna) */
  adaptacija: [
    [
      'List nepokretnosti',
      'Kopija plana parcele',
      'Informacija o lokaciji',
      'Izvod iz planske dokumentacije',
      'Dokaz o pravu na gradnju',
    ],
    [
      'Idejno rešenje',
      'Zahtev za lokacijske uslove (CEOP)',
      'Lokacijski uslovi',
      'Uslovi komunalnih preduzeća',
      'Dokaz o uplati taksi',
    ],
    [
      'Glavni arhitektonski projekat',
      'Projekat konstrukcije (statika)',
      'Projekat instalacija',
      'Elaborat geotehničkih istraživanja',
      'Energetski elaborat',
      'Zahtev za građevinsku dozvolu (CEOP)',
      'Rešenje o građevinskoj dozvoli',
      'Dokaz o uplati doprinosa za uređenje',
    ],
    ['Prijava radova (CEOP)', 'Ugovor sa izvođačem radova', 'Dnevnik građenja'],
    ['Zahtev za tehnički pregled (CEOP)', 'Rešenje o upotrebnoj dozvoli'],
    ['Zahtev za upis u katastar', 'Novi list nepokretnosti'],
  ],

  /** Samo faze 1, 2 i 4 sa minimalnim dokumentima; ostale prazne */
  investiciono_odrzavanje: [
    ['List nepokretnosti', 'Informacija o lokaciji', 'Dokaz o pravu na gradnju'],
    ['Idejno rešenje', 'Lokacijski uslovi', 'Dokaz o uplati taksi'],
    [],
    ['Prijava radova (CEOP)', 'Dnevnik građenja', 'Izveštaji nadzornog organa'],
    [],
    [],
  ],

  tekuce_odrzavanje: [
    ['List nepokretnosti', 'Informacija o lokaciji'],
    ['Lokacijski uslovi', 'Dokaz o uplati taksi'],
    [],
    ['Prijava radova (CEOP)', 'Ugovor sa izvođačem radova', 'Dnevnik građenja'],
    [],
    [],
  ],
};

function buildFazeFromDokumentiPoFazama(dokumentiPoFazama) {
  return FAZE_META.map((meta, i) => ({
    ...meta,
    dokumenti: (dokumentiPoFazama[i] || []).map((naziv) => doc(naziv)),
  }));
}

function fazeZaVrstuRadova(vrstaRadova) {
  const kljuc = vrstaRadova && TEMPLATE_DOKUMENTI[vrstaRadova] ? vrstaRadova : 'nova_gradnja';
  return buildFazeFromDokumentiPoFazama(TEMPLATE_DOKUMENTI[kljuc]);
}

router.get('/napredak/:projekatId', async (req, res) => {
  try {
    const checklist = await Checklist.findOne({
      projekat: req.params.projekatId,
    });
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist nije pronađen' });
    }

    let ukupno = 0;
    let zavrseno = 0;
    for (const faza of checklist.faze || []) {
      for (const dokument of faza.dokumenti || []) {
        ukupno += 1;
        if (dokument.status === 'zavrseno') {
          zavrseno += 1;
        }
      }
    }

    const procenat =
      ukupno === 0 ? 0 : Math.round((zavrseno / ukupno) * 100);

    res.json({ ukupno, zavrseno, procenat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:projekatId', async (req, res) => {
  try {
    const checklist = await Checklist.findOne({
      projekat: req.params.projekatId,
    });
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist nije pronađen' });
    }
    res.json(checklist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:projekatId', async (req, res) => {
  try {
    const projekat = await Projekat.findById(req.params.projekatId);
    if (!projekat) {
      return res.status(404).json({ error: 'Projekat nije pronađen' });
    }

    const faze = fazeZaVrstuRadova(projekat.vrstaRadova);

    const checklist = await Checklist.create({
      projekat: req.params.projekatId,
      faze,
    });
    res.status(201).json(checklist);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Checklist za ovaj projekat već postoji' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:projekatId', async (req, res) => {
  try {
    const result = await Checklist.findOneAndDelete({
      projekat: req.params.projekatId,
    });
    if (!result) {
      return res.status(404).json({ error: 'Checklist nije pronađen' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:projekatId/faza/:fazaId', async (req, res) => {
  try {
    const { projekatId, fazaId } = req.params;
    const updateData = {};
    if (req.body.status !== undefined) updateData['faze.$.status'] = req.body.status;
    if (req.body.datumPocetka !== undefined) updateData['faze.$.datumPocetka'] = req.body.datumPocetka;
    if (req.body.datumZavrsetka !== undefined) updateData['faze.$.datumZavrsetka'] = req.body.datumZavrsetka;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nema podataka za ažuriranje' });
    }

    const checklist = await Checklist.findOneAndUpdate(
      { projekat: projekatId, 'faze._id': fazaId },
      { $set: updateData },
      { new: true }
    );
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist ili faza nije pronađena' });
    }
    res.json(checklist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:projekatId/faza/:fazaId/dokument/:dokumentId', async (req, res) => {
  try {
    const { projekatId, fazaId, dokumentId } = req.params;
    const updateData = {};
    if (req.body.status !== undefined) updateData['faze.$[faza].dokumenti.$[dokument].status'] = req.body.status;
    if (req.body.datumZavrsetka !== undefined) updateData['faze.$[faza].dokumenti.$[dokument].datumZavrsetka'] = req.body.datumZavrsetka;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nema podataka za ažuriranje' });
    }

    const checklist = await Checklist.findOneAndUpdate(
      { projekat: projekatId },
      { $set: updateData },
      {
        arrayFilters: [
          { 'faza._id': new mongoose.Types.ObjectId(fazaId) },
          { 'dokument._id': new mongoose.Types.ObjectId(dokumentId) },
        ],
        new: true,
      }
    );
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist nije pronađen' });
    }
    res.json(checklist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
