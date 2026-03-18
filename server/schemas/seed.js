require('dotenv').config();
const mongoose = require('mongoose');
const { Institucija } = require('./InstitucijaKalkulator');

const institucije = [
  {
    naziv: 'RGZ Katastar',
    url: 'https://katastar.rs',
    kategorija: 'katastar',
    relevantneFaze: [1, 6],
  },
  {
    naziv: 'CEOP portal',
    url: 'https://ceop.apr.gov.rs',
    kategorija: 'urbanizam',
    relevantneFaze: [2, 3, 4, 5],
  },
  {
    naziv: 'eUprava',
    url: 'https://euprava.gov.rs',
    kategorija: 'ostalo',
    relevantneFaze: [1, 2, 3],
  },
  {
    naziv: 'EPS Elektrodistribucija',
    url: 'https://eds.rs',
    kategorija: 'komunalije',
    relevantneFaze: [2, 4],
  },
  {
    naziv: 'Ministarstvo građevinarstva',
    url: 'https://mgsi.gov.rs',
    kategorija: 'gradjevinska_dozvola',
    relevantneFaze: [3],
  },
  {
    naziv: 'JKP Vodovod i kanalizacija',
    kategorija: 'komunalije',
    relevantneFaze: [2, 4],
  },
  {
    naziv: 'Srbijagas',
    url: 'https://srbijagas.com',
    kategorija: 'komunalije',
    relevantneFaze: [2, 4],
  },
  {
    naziv: 'Građevinska inspekcija',
    url: 'https://mgsi.gov.rs',
    kategorija: 'inspekcija',
    relevantneFaze: [4],
  },
  {
    naziv: 'Poreska uprava',
    url: 'https://purs.gov.rs',
    kategorija: 'finansije',
    relevantneFaze: [6],
  },
  {
    naziv: 'Javni beležnik',
    url: 'https://beleznik.org',
    kategorija: 'ostalo',
    relevantneFaze: [1, 6],
  },
];

async function seed() {
  await Institucija.deleteMany({});
  await Institucija.insertMany(institucije);
  console.log(`Uneto ${institucije.length} institucija.`);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  await seed();
  await mongoose.disconnect();
  console.log('Seed završen.');
}

main().catch((err) => {
  console.error('Greška:', err);
  process.exit(1);
});
