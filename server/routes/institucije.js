const express = require('express');
const { Institucija } = require('../schemas/InstitucijaKalkulator');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const institucije = await Institucija.find({ aktivan: true }).sort({
      naziv: 1,
    });
    res.json(institucije);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const institucija = await Institucija.findById(req.params.id);
    if (!institucija) {
      return res.status(404).json({ error: 'Institucija nije pronađena' });
    }
    res.json(institucija);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
