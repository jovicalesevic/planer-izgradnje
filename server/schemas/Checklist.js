const mongoose = require('mongoose');

const fajlSchema = new mongoose.Schema({
  naziv: String,
  url: String,
  uploadovanDatum: Date,
});

const dokumentSchema = new mongoose.Schema({
  naziv: String,
  opis: String,
  obavezan: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['ceka', 'u_toku', 'zavrseno', 'nije_potrebno'],
    default: 'ceka',
  },
  datumZavrsetka: Date,
  fajlovi: [fajlSchema],
  napomena: String,
});

const fazaSchema = new mongoose.Schema({
  brojFaze: {
    type: Number,
    min: 1,
    max: 6,
    required: true,
  },
  naziv: String,
  status: {
    type: String,
    enum: ['zakljucana', 'aktivna', 'u_toku', 'zavrsena'],
  },
  datumPocetka: Date,
  datumZavrsetka: Date,
  dokumenti: [dokumentSchema],
});

const checklistSchema = new mongoose.Schema(
  {
    projekat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projekat',
      required: true,
      unique: true,
    },
    faze: [fazaSchema],
  },
  { timestamps: true }
);

checklistSchema.virtual('procenatZavrsenosti').get(function () {
  let ukupnoObaveznih = 0;
  let zavrsenoObaveznih = 0;

  for (const faza of this.faze || []) {
    for (const dokument of faza.dokumenti || []) {
      if (dokument.obavezan) {
        ukupnoObaveznih++;
        if (dokument.status === 'zavrseno') {
          zavrsenoObaveznih++;
        }
      }
    }
  }

  if (ukupnoObaveznih === 0) return 100;
  return Math.round((zavrsenoObaveznih / ukupnoObaveznih) * 100);
});

checklistSchema.set('toJSON', { virtuals: true });
checklistSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Checklist', checklistSchema);
