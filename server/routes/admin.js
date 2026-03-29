const express = require('express');
const isAdmin = require('../middleware/isAdmin');
const { Institucija } = require('../schemas/InstitucijaKalkulator');

const router = express.Router();

router.use(isAdmin);

router.get('/institucije', async (req, res) => {
  try {
    const institucije = await Institucija.find().sort({ naziv: 1 });
    res.json(institucije);
  } catch (err) {
    console.error('Upload greška:', err);
    res.status(500).json({ error: err.message || String(err), stack: err.stack });
  }
});

router.post('/institucije', async (req, res) => {
  try {
    const institucija = await Institucija.create(req.body);
    res.status(201).json(institucija);
  } catch (err) {
    console.error('Upload greška:', err);
    res.status(500).json({ error: err.message || String(err), stack: err.stack });
  }
});

router.put('/institucije/:id', async (req, res) => {
  try {
    const institucija = await Institucija.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!institucija) {
      return res.status(404).json({ error: 'Institucija nije pronađena' });
    }
    res.json(institucija);
  } catch (err) {
    console.error('Upload greška:', err);
    res.status(500).json({ error: err.message || String(err), stack: err.stack });
  }
});

router.delete('/institucije/:id', async (req, res) => {
  try {
    const institucija = await Institucija.findByIdAndDelete(req.params.id);
    if (!institucija) {
      return res.status(404).json({ error: 'Institucija nije pronađena' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Upload greška:', err);
    res.status(500).json({ error: err.message || String(err), stack: err.stack });
  }
});

module.exports = router;
