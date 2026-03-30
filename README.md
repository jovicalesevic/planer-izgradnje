# Planer Izgradnje

---

## Srpski (ekavica)

### Opis aplikacije

**Planer Izgradnje** je veb aplikacija za planiranje i praćenje projekata izgradnje u Srbiji. Korisnici kreiraju projekte, prate napredak kroz strukturisanu checklistu faza i dokumenata, pregledaju relevantne institucije, procenjuju indikativne troškove, konsultuju AI asistenta specijalizovanog za građevinsku proceduru i prilažu dokumenta (PDF/slike). Administratori upravljaju bazom institucija.

### Funkcionalnosti

| Modul | Opis |
|--------|------|
| **Checklist** | Šest faza gradnje sa listom dokumenata po vrsti radova; status dokumenta (čekanje / završeno); napredak u procentima; čekiranje završenih stavki; prilaganje više fajlova po dokumentu; brisanje priloga. |
| **Institucije** | Pregled aktivnih institucija (kategorije, opis, linkovi, relevantne faze). |
| **Kalkulator** | Indikativni troškovi na osnovu površine, tipa objekta i vrste radova (projektovanje, doprinosi, takse, komunalije, geodetski radovi itd.). |
| **AI asistent** | Ćaskanje sa modelom Anthropic Claude, sistemska uloga usmerena na građevinsku proceduru u Srbiji. |
| **Upload dokumenata** | Otpremanje fajlova na Cloudinary, vezivanje za dokument u checklisti; uklanjanje pojedinačnog priloga. |
| **Admin panel** | Za korisnike sa ulogom `admin` u Clerk public metadata: CRUD nad institucijama (`/admin`). |

### Tehnički stack

| Sloj | Tehnologije |
|------|----------------|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4 (@tailwindcss/vite), Clerk React |
| **Backend** | Node.js, Express 5, Mongoose 9, Clerk Express, Multer + Cloudinary |
| **Baza** | MongoDB |
| **AI** | Anthropic API (Claude) |
| **Skladište fajlova** | Cloudinary |
| **Autentikacija** | Clerk |

### Instalacija i pokretanje

**Preduslovi:** Node.js 18+, MongoDB (lokalno ili Atlas), nalozi i ključevi za Clerk, Anthropic i Cloudinary.

```bash
# koren repozitorijuma
cd server && npm install
cd ../client && npm install
```

**Server** — u `server/` kreirati `.env` (vidi tabelu ispod), zatim:

```bash
cd server
node index.js
```

Podrazumevani port: **5000**.

**Klijent** — u `client/` opciono `.env` sa `VITE_*` varijablama:

```bash
cd client
npm run dev
```

Aplikacija: **http://localhost:5173**.

Opciono: `npm run seed` u `server/` za inicijalne podatke (ako postoji `schemas/seed.js`).

### Environment varijable

**Server (`server/.env`):**

| Varijabla | Opis |
|-----------|------|
| `MONGO_URI` | Connection string za MongoDB |
| `ANTHROPIC_API_KEY` | API ključ za Anthropic (AI ruta) |
| `CLERK_PUBLISHABLE_KEY` | Javni Clerk ključ (ako ga backend koristi u konfiguraciji) |
| `CLERK_SECRET_KEY` | Tajni Clerk ključ za `@clerk/express` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Klijent (`client/.env`, prefiks `VITE_`):**

| Varijabla | Opis |
|-----------|------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key za `<ClerkProvider>` |
| `VITE_API_URL` | Baza URL backend API-ja, npr. `http://localhost:5000/api` (podrazumevano u kodu ako nije postavljeno) |

### Struktura projekta

```
planer-izgradnje/
├── client/                 # React (Vite)
│   ├── public/             # statika, manifest, service worker (sw.js)
│   └── src/
│       ├── api/            # useApi — pozivi ka backendu
│       ├── components/     # Navbar, Footer, Toast, …
│       ├── hooks/          # npr. useToast
│       ├── pages/          # Dashboard, NoviProjekat, ProjekatDetalji,
│       │                     Institucije, Kalkulator, AIAsistent, AdminPanel
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── routes/             # institucije, projekti, checklist, ai, admin, upload
│   ├── schemas/            # Mongoose modeli
│   ├── middleware/         # npr. isAdmin
│   ├── services/           # cloudinary, …
│   └── index.js
└── README.md
```

### API endpointi

Osnova: **`/api`**. Zaštićene rute zahtevaju **`Authorization: Bearer <Clerk JWT>`** (osim javnog čitanja institucija gde je tako implementirano).

**Projekti** (`/api/projekti`)

| Metoda | Putanja |
|--------|---------|
| GET | `/` |
| POST | `/` |
| GET | `/:id` |
| PUT | `/:id` |
| DELETE | `/:id` |

**Checklist** (`/api/checklist`)

| Metoda | Putanja |
|--------|---------|
| GET | `/napredak/:projekatId` |
| GET | `/:projekatId` |
| POST | `/:projekatId` |
| DELETE | `/:projekatId` |
| PUT | `/:projekatId/faza/:fazaId` |
| PUT | `/:projekatId/faza/:fazaId/dokument/:dokumentId` |

**Institucije (javno)** (`/api/institucije`)

| Metoda | Putanja |
|--------|---------|
| GET | `/` |
| GET | `/:id` |

**AI** (`/api/ai`)

| Metoda | Putanja |
|--------|---------|
| POST | `/poruka` |

**Upload** (`/api/upload`)

| Metoda | Putanja |
|--------|---------|
| POST | `/:projekatId/faza/:fazaId/dokument/:dokumentId` — telo: `multipart/form-data`, polje `fajl` |
| DELETE | `/:projekatId/faza/:fazaId/dokument/:dokumentId/fajl/:fajlId` |

**Admin** (`/api/admin`) — zahteva admin ulogu u Clerk-u

| Metoda | Putanja |
|--------|---------|
| GET | `/institucije` |
| POST | `/institucije` |
| PUT | `/institucije/:id` |
| DELETE | `/institucije/:id` |

**Koren servera:** `GET /` — provera da server radi.

---

**Copyright © 2026 Planer Izgradnje.**

---

## English

### Application description

**Planer Izgradnje** is a web application for planning and tracking construction projects in Serbia. Users create projects, follow progress through a structured checklist of phases and documents, browse relevant institutions, estimate indicative costs, chat with an AI assistant focused on the local building-permit workflow, and attach files (PDF/images). Administrators manage the institution database.

### Features

| Module | Description |
|--------|----------------|
| **Checklist** | Six construction phases with document lists depending on work type; document status; completion progress; toggling items; multiple attachments per document; removing attachments. |
| **Institutions** | Browse active institutions (categories, description, links, relevant phases). |
| **Calculator** | Indicative costs from area, building type, and work type (design, levies, fees, utilities, surveying, etc.). |
| **AI assistant** | Chat with Anthropic Claude, system prompt oriented to construction procedures in Serbia. |
| **Document upload** | Upload files to Cloudinary linked to checklist documents; delete individual attachments. |
| **Admin panel** | For users with Clerk `admin` in public metadata: CRUD for institutions at `/admin`. |

### Tech stack

| Layer | Technologies |
|--------|----------------|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4 (@tailwindcss/vite), Clerk React |
| **Backend** | Node.js, Express 5, Mongoose 9, Clerk Express, Multer + Cloudinary |
| **Database** | MongoDB |
| **AI** | Anthropic API (Claude) |
| **File storage** | Cloudinary |
| **Auth** | Clerk |

### Installation and running

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas), Clerk, Anthropic, and Cloudinary credentials.

```bash
cd server && npm install
cd ../client && npm install
```

**Server** — create `server/.env` (see variables below), then:

```bash
cd server
node index.js
```

Default port: **5000**.

**Client** — optional `client/.env` with `VITE_*` variables:

```bash
cd client
npm run dev
```

App URL: **http://localhost:5173**.

Optional: `npm run seed` in `server/` if seed script is configured.

### Environment variables

**Server (`server/.env`):**

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `ANTHROPIC_API_KEY` | Anthropic API key (AI route) |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key (if used by backend config) |
| `CLERK_SECRET_KEY` | Clerk secret key for `@clerk/express` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Client (`client/.env`, `VITE_` prefix):**

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for `<ClerkProvider>` |
| `VITE_API_URL` | API base URL, e.g. `http://localhost:5000/api` (fallback in code if unset) |

### Project structure

```
planer-izgradnje/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── routes/
│   ├── schemas/
│   ├── middleware/
│   ├── services/
│   └── index.js
└── README.md
```

### API endpoints

Base path: **`/api`**. Protected routes expect **`Authorization: Bearer <Clerk JWT>`** where implemented.

**Projects** — `/api/projekti`: `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`

**Checklist** — `/api/checklist`: `GET /napredak/:projekatId`, `GET|POST|DELETE /:projekatId`, `PUT /:projekatId/faza/:fazaId`, `PUT /:projekatId/faza/:fazaId/dokument/:dokumentId`

**Institutions (public)** — `/api/institucije`: `GET /`, `GET /:id`

**AI** — `/api/ai`: `POST /poruka`

**Upload** — `/api/upload`: `POST /:projekatId/faza/:fazaId/dokument/:dokumentId` (multipart field `fajl`), `DELETE /:projekatId/faza/:fazaId/dokument/:dokumentId/fajl/:fajlId`

**Admin** — `/api/admin`: `GET|POST /institucije`, `PUT|DELETE /institucije/:id` (admin role required)

**Server root:** `GET /` — health message.

---

**Copyright © 2026 Planer Izgradnje.**
