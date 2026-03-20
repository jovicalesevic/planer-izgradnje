const mongoose = require('mongoose');

const projekatSchema = new mongoose.Schema(
  {
    korisnik: {
      type: String,
      required: true,
    },
    naziv: {
      type: String,
      required: true,
    },
    tipObjekta: {
      type: String,
      enum: ['stambeni', 'pomocni', 'ekonomski', 'poslovni'],
    },
    vrstaRadova: {
      type: String,
      enum: [
        'nova_gradnja',
        'rekonstrukcija',
        'adaptacija',
        'investiciono_odrzavanje',
        'tekuce_odrzavanje',
        'dogradnja',
        'promena_namene',
      ],
    },
    lokacija: {
      opstina: String,
      katastarskaOpstina: String,
      brojevParcele: String,
      adresa: String,
      koordinate: {
        lat: Number,
        lng: Number,
      },
    },
    aktivnaFaza: {
      type: Number,
      min: 1,
      max: 6,
      default: 1,
    },
    status: {
      type: String,
      enum: ['aktivan', 'pauziran', 'zavrsen', 'odustalo'],
      default: 'aktivan',
    },
    povrsinaParcelam2: Number,
    povrsinaGradjevinem2: Number,
    spratnost: Number,
    procenjenaVrednostEur: Number,
    napomene: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Projekat', projekatSchema);
