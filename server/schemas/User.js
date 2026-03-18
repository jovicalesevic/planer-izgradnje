const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    ime: {
      type: String,
      required: true,
    },
    prezime: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telefon: {
      type: String,
    },
    lokacija: {
      opstina: String,
      grad: String,
      region: String,
    },
    uloga: {
      type: String,
      enum: ['investitor', 'izvodjac', 'projektant', 'admin'],
      default: 'investitor',
    },
    podeskavanja: {
      obavesenja: {
        type: Boolean,
        default: true,
      },
      jezik: {
        type: String,
        default: 'sr',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
