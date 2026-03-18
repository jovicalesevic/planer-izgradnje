const express = require('express');
const mongoose = require('mongoose');
const Checklist = require('../schemas/Checklist');

const router = express.Router();

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

const doc = (naziv) => ({ naziv, status: 'ceka' });

const DEFAULT_FAZE = [
  {
    brojFaze: 1,
    naziv: 'Priprema i provera parcele',
    status: 'aktivna',
    dokumenti: [
      doc('List nepokretnosti'),
      doc('Kopija plana parcele'),
      doc('Informacija o lokaciji'),
      doc('Izvod iz planske dokumentacije'),
      doc('Dokaz o pravu na gradnju'),
    ],
  },
  {
    brojFaze: 2,
    naziv: 'Idejno rešenje i lokacijski uslovi',
    status: 'zakljucana',
    dokumenti: [
      doc('Idejno rešenje'),
      doc('Zahtev za lokacijske uslove (CEOP)'),
      doc('Lokacijski uslovi'),
      doc('Uslovi komunalnih preduzeća'),
      doc('Dokaz o uplati taksi'),
    ],
  },
  {
    brojFaze: 3,
    naziv: 'Glavni projekat i građevinska dozvola',
    status: 'zakljucana',
    dokumenti: [
      doc('Glavni arhitektonski projekat'),
      doc('Projekat konstrukcije (statika)'),
      doc('Projekat instalacija'),
      doc('Elaborat geotehničkih istraživanja'),
      doc('Energetski elaborat'),
      doc('Zahtev za građevinsku dozvolu (CEOP)'),
      doc('Rešenje o građevinskoj dozvoli'),
      doc('Dokaz o uplati doprinosa za uređenje'),
    ],
  },
  {
    brojFaze: 4,
    naziv: 'Gradnja',
    status: 'zakljucana',
    dokumenti: [
      doc('Prijava radova (CEOP)'),
      doc('Ugovor sa izvođačem radova'),
      doc('Dnevnik građenja'),
      doc('Atesti za ugrađene materijale'),
      doc('Izveštaji nadzornog organa'),
    ],
  },
  {
    brojFaze: 5,
    naziv: 'Tehnički pregled i upotrebna dozvola',
    status: 'zakljucana',
    dokumenti: [
      doc('Zahtev za tehnički pregled (CEOP)'),
      doc('Projekat izvedenog stanja (as-built)'),
      doc('Izveštaj komisije tehničkog pregleda'),
      doc('Dokaz o plaćenim komunalnim priključcima'),
      doc('Rešenje o upotrebnoj dozvoli'),
    ],
  },
  {
    brojFaze: 6,
    naziv: 'Uknjižba',
    status: 'zakljucana',
    dokumenti: [
      doc('Elaborat geodetskih radova'),
      doc('Zahtev za upis u katastar'),
      doc('Rešenje RGZ o upisu objekta'),
      doc('Novi list nepokretnosti'),
    ],
  },
];

router.post('/:projekatId', async (req, res) => {
  try {
    const checklist = await Checklist.create({
      projekat: req.params.projekatId,
      faze: DEFAULT_FAZE,
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
