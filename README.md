# Leads Tracking App

A small full-stack web portal for managing sales leads, backed by a REST API. Users can create leads, search and filter them by name, email or status, view lead details, and keep a running log of notes for each lead.

## Features

- Lead CRUD (create, read, update, delete)
- Search leads by name or email
- Filter leads by status
- Notes per lead (one-to-many relationship)
- Server-side validation with clear error messages
- SQLite database with Prisma ORM
- REST API built with Express and TypeScript
- React (Vite) frontend with clean, responsive UI
- Simple pagination on the leads list endpoint
- Automated API tests (Jest + Supertest)

## Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Backend   | Node.js, Express, TypeScript         |
| Database  | SQLite, Prisma ORM                   |
| Frontend  | React, Vite, TypeScript, Axios       |
| Testing   | Jest, Supertest                      |

## Project Structure

```
leads-tracking-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers (parse input, call services, send responses)
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business logic + Prisma database calls
│   │   ├── middleware/     # Centralized error handling
│   │   ├── utils/          # Validation helpers, ApiError class
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # App entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database models (Lead, Note)
│   │   └── seed.ts         # Sample data seed script
│   ├── tests/
│   │   └── leads.test.ts   # API tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # LeadForm, LeadList, NoteList, StatusBadge
│   │   ├── pages/          # LeadsPage, CreateLeadPage, LeadDetailPage
│   │   ├── services/       # Axios API client
│   │   ├── App.tsx         # Route definitions
│   │   └── main.tsx        # App entry point
│   └── package.json
├── package.json             # Root scripts (runs backend + frontend together)
└── README.md
```

## Installation

```bash
git clone <repository-url>
cd leads-tracking-app
npm install
```

`npm install` at the root also installs the backend and frontend dependencies (via `postinstall`).

### Database Setup

```bash
cd backend
copy .env.example .env    # on macOS/Linux: cp .env.example .env
npx prisma migrate dev
npm run seed
cd ..
```

This creates the SQLite database file (`backend/prisma/dev.db`), applies the schema, and inserts 5 sample leads with notes.

### Run the App

From the project root:

```bash
npm run dev
```

This starts both servers concurrently:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

## Other Scripts

Run from the project root:

```bash
npm run build   # builds backend (TypeScript) and frontend (Vite) for production
npm test        # runs backend API tests
npm run seed    # re-seeds the database with sample data
npm run migrate # runs Prisma migrations
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Get all leads

```bash
curl http://localhost:5000/api/leads
```

### Search and filter

```bash
curl "http://localhost:5000/api/leads?search=john&status=new"
```

### Get a single lead

```bash
curl http://localhost:5000/api/leads/1
```

### Create a lead

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "new"
  }'
```

### Update a lead

```bash
curl -X PATCH http://localhost:5000/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{ "status": "contacted" }'
```

### Delete a lead

```bash
curl -X DELETE http://localhost:5000/api/leads/1
```

### Get notes for a lead

```bash
curl http://localhost:5000/api/leads/1/notes
```

### Add a note to a lead

```bash
curl -X POST http://localhost:5000/api/leads/1/notes \
  -H "Content-Type: application/json" \
  -d '{ "content": "Called and left a voicemail." }'
```

### Error response format

```json
{
  "message": "Lead not found"
}
```

```json
{
  "message": "Validation failed",
  "errors": ["Name is required", "Email is invalid"]
}
```

## Testing

```bash
cd backend
npm test
```

Tests cover creating a lead (success and validation failure) and fetching a lead by ID (found and 404 not found).

## Deployment

The database is SQLite, a file on disk — that needs a normal always-on server, not a serverless function. So the two halves deploy to two different places:

- **Backend (API)** → [Render](https://render.com) (free tier, a regular Node process with a persistent-during-uptime filesystem)
- **Frontend (React app)** → [Vercel](https://vercel.com) (static hosting, exactly what it's built for)

### 1. Deploy the backend to Render

1. Push this repo to GitHub.
2. In Render, choose **New → Blueprint** and point it at this repo — it will read [`render.yaml`](render.yaml) and configure the service automatically (root directory `backend`, build command, start command, `DATABASE_URL`).
   - Or configure it manually: New → Web Service → root directory `backend` → build command `npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build && npm run seed` → start command `npm start` → env var `DATABASE_URL=file:./dev.db`.
3. Once deployed, copy the service URL (e.g. `https://leads-tracker-api.onrender.com`).

Note: on Render's free tier, the SQLite file resets on each redeploy (no persistent disk on the free plan) — the build command reseeds sample data automatically so the demo always has data. This is fine for an assignment/demo; a real production setup would attach a persistent disk or use a hosted database.

### 2. Deploy the frontend to Vercel

1. In Vercel, **Add New → Project**, import this repo. [`vercel.json`](vercel.json) at the repo root tells Vercel to build only the `frontend/` folder.
2. Before deploying, add an environment variable:
   - `VITE_API_BASE_URL` = `https://leads-tracker-api.onrender.com/api` (your Render URL from step 1, with `/api` appended)
3. Deploy. Vercel builds the Vite app and serves it as a static site, with client-side routing handled by the rewrite rule in `vercel.json`.

Locally, leave `VITE_API_BASE_URL` unset — the Vite dev server proxies `/api` straight to `http://localhost:5000` (see [`vite.config.ts`](frontend/vite.config.ts)), so no env var is needed for local development.

## Future Improvements

- Authentication and role-based access control
- Cursor-based pagination for large datasets
- More automated test coverage (frontend + more API edge cases)
- Deployment pipeline (Docker Compose for backend + frontend, hosted Postgres instead of SQLite)
