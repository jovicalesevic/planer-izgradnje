const mongoose = require('mongoose');

const institucijaSchema = new mongoose.Schema(
  {
    naziv: String,
    skracenica: String,
    kategorija: {
      type: String,
      enum: [
        'katastar',
        'urbanizam',
        'gradjevinska_dozvola',
        'komunalije',
        'inspekcija',
        'finansije',
        'ostalo',
      ],
    },
    opis: String,
    url: String,
    telefon: String,
    email: String,
    adresa: String,
    radnoVreme: String,
    relevantneFaze: [Number],
    napomena: String,
    aktivan: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const stavkaSchema = new mongoose.Schema({
  naziv: String,
  kategorija: {
    type: String,
    enum: ['taksa', 'doprinos', 'projekat', 'izgradnja', 'ostalo'],
  },
  iznosEur: Number,
  napomena: String,
  izvor: String,
});

const kalkulatorSchema = new mongoose.Schema(
  {
    projekat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projekat',
      required: true,
      unique: true,
    },
    ulazniPodaci: {
      povrsinaParcelam2: Number,
      povrsinaGradjevinem2: Number,
      spratnost: Number,
      zonaPDR: String,
      procenjenaVrednostEur: Number,
      tipObjekta: String,
      vrstaRadova: String,
      opstina: String,
    },
    stavke: [stavkaSchema],
    ukupnoEur: Number,
    datumObracuna: Date,
    napomena: String,
  },
  { timestamps: true }
);

const Institucija = mongoose.model('Institucija', institucijaSchema);
const Kalkulator = mongoose.model('Kalkulator', kalkulatorSchema);

module.exports = { Institucija, Kalkulator };
