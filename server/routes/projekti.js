const express = require('express');
const { getAuth } = require('@clerk/express');
const Projekat = require('../schemas/Projekat');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Neautorizovan' });
    }
    const projekti = await Projekat.find({ korisnik: userId });
    res.json(projekti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Neautorizovan' });
    }
    const projekat = await Projekat.create({ ...req.body, korisnik: userId });
    res.status(201).json(projekat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const projekat = await Projekat.findById(req.params.id);
    if (!projekat) {
      return res.status(404).json({ error: 'Projekat nije pronađen' });
    }
    res.json(projekat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const projekat = await Projekat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!projekat) {
      return res.status(404).json({ error: 'Projekat nije pronađen' });
    }
    res.json(projekat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const projekat = await Projekat.findByIdAndDelete(req.params.id);
    if (!projekat) {
      return res.status(404).json({ error: 'Projekat nije pronađen' });
    }
    res.json({ message: 'Projekat obrisan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
