# Planer Izgradnje

> A web application for planning and managing construction projects in Serbia, with an integrated AI assistant, cost calculator, and a database of relevant institutions.

> Veb aplikacija za planiranje i upravljanje projektima izgradnje u Srbiji, sa integrisanim AI asistentom, kalkulatorom troškova i bazom relevantnih institucija.

---

## Features / Funkcionalnosti

### 🏗️ Construction Phase Checklist / Checklist faza gradnje
Manage all phases of a construction project through a structured checklist. Track the status of required documents and permits for each phase — from obtaining the location permit to final registration of the facility.

Upravljajte svim fazama građevinskog projekta kroz strukturisani checklist. Pratite status potrebnih dokumenata i dozvola za svaku fazu — od ishođenja lokacijske informacije do konačne uknjižbe objekta.

### 🏛️ Institution Database / Baza institucija
Browse a curated database of institutions relevant to the construction process in Serbia (municipalities, public enterprises, utility companies, etc.), each with a direct link to their official website and information about which project phases they are involved in.

Pregledajte bazu institucija relevantnih za proces izgradnje u Srbiji (opštine, javna preduzeća, komunalna preduzeća i dr.), svaka sa direktnim linkom na zvanični sajt i informacijom o fazama u kojima učestvuje.

### 🧮 Cost Calculator / Kalkulator troškova
Estimate the indicative costs of your construction project based on building area, object type, and type of works. Includes items such as design costs, development contributions, building permit fees, utility connections, and geodetic surveys.

Procijenite indikativne troškove građevinskog projekta na osnovu površine objekta, tipa objekta i vrste radova. Uključuje stavke kao što su troškovi projektovanja, doprinos za uređenje, taksa za građevinsku dozvolu, komunalni priključci i geodetski elaborat.

### 🤖 AI Assistant / AI Asistent
Chat with an AI assistant powered by Anthropic Claude, specialized in answering questions about the construction permitting and building process in Serbia. Get guidance on required documentation, legal obligations, and process steps.

Razgovarajte sa AI asistentom pokrenutim tehnologijom Anthropic Claude, specijalizovanim za odgovaranje na pitanja o procesu ishođenja dozvola i izgradnje u Srbiji. Dobijte smjernice o potrebnoj dokumentaciji, zakonskim obavezama i koracima u procesu.

---

## Tech Stack / Tehnički stack

### Frontend
| Technology | Version |
|---|---|
| [React](https://react.dev/) | ^19 |
| [Vite](https://vitejs.dev/) | ^6 |
| [React Router DOM](https://reactrouter.com/) | ^7 |

### Backend
| Technology | Version |
|---|---|
| [Node.js](https://nodejs.org/) | ≥18 |
| [Express](https://expressjs.com/) | ^5 |
| [MongoDB](https://www.mongodb.com/) | — |
| [Mongoose](https://mongoosejs.com/) | ^9 |

### AI
| Technology | Version |
|---|---|
| [Anthropic Claude API](https://www.anthropic.com/) | `@anthropic-ai/sdk` ^0.79 |

---

## Installation & Setup / Instalacija i pokretanje

### Prerequisites / Preduslovi
- Node.js ≥ 18
- MongoDB instance (local or Atlas)
- Anthropic API key

### 1. Clone the repository / Klonirajte repozitorijum

```bash
git clone <repository-url>
cd planer-izgradnje
```

### 2. Backend setup / Podešavanje backend-a

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#environment-variables--environment-varijable) below), then start the server:

Kreirajte `.env` fajl u `server/` direktorijumu (pogledajte [Environment varijable](#environment-variables--environment-varijable) ispod), zatim pokrenite server:

```bash
node index.js
```

The server runs on `https://planer-izgradnje-api.onrender.com` by default.

Server se pokreće na `https://planer-izgradnje-api.onrender.com` po defaultu.

### 3. Seed the database / Popunite bazu podataka

To populate the database with initial institution data and checklist templates:

Za popunjavanje baze sa inicijalnim podacima o institucijama i šablonima checkliste:

```bash
cd server
npm run seed
```

### 4. Frontend setup / Podešavanje frontend-a

```bash
cd client
npm install
npm run dev
```

The application runs on `http://localhost:5173` by default.

Aplikacija se pokreće na `http://localhost:5173` po defaultu.

---

## Environment Variables / Environment varijable

Create a `.env` file in the `server/` directory with the following variables:

Kreirajte `.env` fajl u `server/` direktorijumu sa sljedećim varijablama:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/planer-izgradnje

# Anthropic Claude API key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server port (optional, default: 5000)
PORT=5000
```

---

## Project Structure / Struktura projekta

```
planer-izgradnje/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── api/             # API helper functions
│       ├── components/      # Shared components (Navbar)
│       └── pages/           # Page components
│           ├── Dashboard.jsx
│           ├── NoviProjekat.jsx
│           ├── ProjekatDetalji.jsx
│           ├── Institucije.jsx
│           ├── Kalkulator.jsx
│           └── AIAsistent.jsx
└── server/                  # Node.js / Express backend
    ├── routes/              # API route handlers
    ├── schemas/             # Mongoose schemas & seed data
    └── index.js             # Server entry point
```

---

## API Endpoints / API Endpointi

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projekti` | Get all projects / Svi projekti |
| POST | `/api/projekti` | Create project / Kreiraj projekat |
| GET | `/api/projekti/:id` | Get project by ID / Projekat po ID |
| PUT | `/api/projekti/:id` | Update project / Ažuriraj projekat |
| DELETE | `/api/projekti/:id` | Delete project / Obriši projekat |
| GET | `/api/checklist/:projekatId` | Get checklist / Dobavi checklist |
| POST | `/api/checklist/:projekatId` | Create checklist / Kreiraj checklist |
| PUT | `/api/checklist/:projekatId/faza/:fazaId/dokument/:dokumentId` | Update document status / Ažuriraj status dokumenta |
| GET | `/api/institucije` | Get all institutions / Sve institucije |
| POST | `/api/ai/poruka` | Send message to AI / Pošalji poruku AI-u |

---

## License / Licenca

Copyright © 2026 Planer Izgradnje. Sva prava zadržana. / All rights reserved.
