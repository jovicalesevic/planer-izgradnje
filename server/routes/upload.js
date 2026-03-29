const express = require('express');
const mongoose = require('mongoose');
const { getAuth } = require('@clerk/express');
const { upload } = require('../services/cloudinary');
const Checklist = require('../schemas/Checklist');
const Projekat = require('../schemas/Projekat');

const router = express.Router();

router.delete(
  '/:projekatId/faza/:fazaId/dokument/:dokumentId/fajl/:fajlId',
  async (req, res) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ error: 'Neautorizovan' });
      }

      const { projekatId, fazaId, dokumentId, fajlId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(fajlId)) {
        return res.status(400).json({ error: 'Nevažeći ID fajla' });
      }

      const projekat = await Projekat.findOne({
        _id: projekatId,
        korisnik: userId,
      });
      if (!projekat) {
        return res.status(404).json({ error: 'Projekat nije pronađen' });
      }

      const checklistPre = await Checklist.findOne({ projekat: projekatId });
      if (!checklistPre) {
        return res.status(404).json({ error: 'Checklist nije pronađen' });
      }

      const fazaPre = checklistPre.faze.id(fazaId);
      if (!fazaPre) {
        return res.status(404).json({ error: 'Faza nije pronađena' });
      }
      const dokumentPre = fazaPre.dokumenti.id(dokumentId);
      if (!dokumentPre) {
        return res.status(404).json({ error: 'Dokument nije pronađen' });
      }
      if (!dokumentPre.fajlovi.id(fajlId)) {
        return res.status(404).json({ error: 'Fajl nije pronađen' });
      }

      const checklist = await Checklist.findOneAndUpdate(
        { projekat: projekatId },
        {
          $pull: {
            'faze.$[f].dokumenti.$[d].fajlovi': { _id: new mongoose.Types.ObjectId(fajlId) },
          },
        },
        {
          arrayFilters: [
            { 'f._id': new mongoose.Types.ObjectId(fazaId) },
            { 'd._id': new mongoose.Types.ObjectId(dokumentId) },
          ],
          new: true,
        }
      );

      if (!checklist) {
        return res.status(404).json({ error: 'Checklist nije pronađen' });
      }

      const fazaPosle = checklist.faze.id(fazaId);
      const dokumentPosle = fazaPosle.dokumenti.id(dokumentId);
      return res.json(dokumentPosle.toJSON ? dokumentPosle.toJSON() : dokumentPosle);
    } catch (err) {
      console.error('Upload greška:', err);
      return res.status(500).json({ error: err.message || String(err), stack: err.stack });
    }
  }
);

router.post(
  '/:projekatId/faza/:fazaId/dokument/:dokumentId',
  async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ error: 'Neautorizovan' });
      }

      const projekat = await Projekat.findOne({
        _id: req.params.projekatId,
        korisnik: userId,
      });
      if (!projekat) {
        return res.status(404).json({ error: 'Projekat nije pronađen' });
      }

      const checklist = await Checklist.findOne({ projekat: req.params.projekatId });
      if (!checklist) {
        return res.status(404).json({ error: 'Checklist nije pronađen' });
      }

      const { fazaId, dokumentId } = req.params;
      const faza = checklist.faze.id(fazaId);
      if (!faza) {
        return res.status(404).json({ error: 'Faza nije pronađena' });
      }
      const dokument = faza.dokumenti.id(dokumentId);
      if (!dokument) {
        return res.status(404).json({ error: 'Dokument nije pronađen' });
      }

      next();
    } catch (err) {
      console.error('Upload greška:', err);
      next(err);
    }
  },
  upload.single('fajl'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Fajl je obavezan (polje: fajl)' });
      }

      const { projekatId, fazaId, dokumentId } = req.params;

      const noviFajl = {
        naziv: req.file.originalname || req.file.filename || 'fajl',
        url: req.file.path,
        uploadovanDatum: new Date(),
      };

      const checklist = await Checklist.findOneAndUpdate(
        { projekat: projekatId },
        {
          $push: {
            'faze.$[f].dokumenti.$[d].fajlovi': noviFajl,
          },
        },
        {
          arrayFilters: [
            { 'f._id': new mongoose.Types.ObjectId(fazaId) },
            { 'd._id': new mongoose.Types.ObjectId(dokumentId) },
          ],
          new: true,
        }
      );

      if (!checklist) {
        return res.status(404).json({ error: 'Checklist nije pronađen' });
      }

      const fazaPosle = checklist.faze.id(fazaId);
      if (!fazaPosle) {
        return res.status(404).json({ error: 'Faza nije pronađena' });
      }
      const dokumentPosle = fazaPosle.dokumenti.id(dokumentId);
      if (!dokumentPosle) {
        return res.status(404).json({ error: 'Dokument nije pronađen' });
      }

      return res.status(200).json(dokumentPosle.toJSON ? dokumentPosle.toJSON() : dokumentPosle);
    } catch (err) {
      console.error('Upload greška:', err);
      return res.status(500).json({ error: err.message || String(err), stack: err.stack });
    }
  }
);

module.exports = router;
