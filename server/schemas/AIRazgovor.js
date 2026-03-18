const mongoose = require('mongoose');

const porukaSchema = new mongoose.Schema({
  uloga: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  sadrzaj: {
    type: String,
    required: true,
  },
  vremeSlanja: {
    type: Date,
    default: Date.now,
  },
});

const razgovorSchema = new mongoose.Schema(
  {
    korisnik: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projekat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projekat',
      default: null,
    },
    naslov: String,
    poruke: [porukaSchema],
    aktivno: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIRazgovor', razgovorSchema);
