# TinyLink

TinyLink is a minimal URL shortener web app inspired by bit.ly. It supports:

- Creating short links with optional custom codes
- 302 redirects from `/:code` to the long URL
- Tracking total click count and last clicked timestamp
- Listing and deleting links from a dashboard
- Viewing stats for a single code at `/code/:code`
- Health check endpoint at `/healthz`

This implementation follows the specification from the TinyLink take-home assignment.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Runtime:** Node.js
- **Database:** Postgres (e.g. Neon)
- **ORM / DB Client:** `pg` (lightweight Postgres client)
- **Styling:** Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL` – Postgres connection string (Neon recommended)
- `NEXT_PUBLIC_BASE_URL` – The base URL for your deployment (e.g. Vercel URL)

### 3. Create the database schema

Run the SQL in `schema.sql` against your Postgres database, for example:

```bash
psql "$DATABASE_URL" -f schema.sql
```

This will create a `links` table with:

- `code` – unique short code (`[A-Za-z0-9]{6,8}`)
- `target_url` – original long URL
- `click_count` – total redirects
- `last_clicked_at` – timestamp of last redirect
- `created_at` – timestamp when the link was created

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Routes & Endpoints

### Pages

- `/` – Dashboard
  - Create new short links
  - Table of all links (code, target URL, clicks, last clicked)
  - Search/filter by code or URL
  - Delete actions
- `/code/:code` – Stats for a single link
- `/:code` – Redirect (302 or 404)
- `/healthz` – Health check

### API

These endpoints are used by the UI and for automated tests:

- `GET /healthz`
  - Returns status 200 with JSON: `{ "ok": true, "version": "1.0" }`

- `POST /api/links`
  - Body: `{ "url": "https://example.com", "code": "optionalCustom" }`
  - Validates URL
  - Custom code (if provided) must match `[A-Za-z0-9]{6,8}`
  - Returns `409` if the code already exists
  - Auto-generates a 6-character code when not provided

- `GET /api/links`
  - Returns a JSON array of all links

- `GET /api/links/:code`
  - Returns stats for one code
  - `404` if not found

- `DELETE /api/links/:code`
  - Deletes a link
  - `404` if not found

### Redirect behavior

- Visiting `/:code` performs an HTTP 302 redirect to the original URL when found.
- Each redirect increments the `click_count` and updates `last_clicked_at`.
- If the code is unknown (or deleted), the route returns `404`.

## UI / UX Notes

- Clean, minimal dark theme using Tailwind CSS
- Dashboard shows:
  - Empty state when there are no links
  - Inline errors and success messages when creating links
  - Disabled submit state during network calls
- Table features:
  - Search by code or URL
  - Truncated long URLs with ellipsis
  - Copy short URL button
  - Stats and Delete actions
- Responsive layout that works on narrow screens

## Deployment Tips

- **Frontend + API:** Deploy the Next.js app on Vercel.
- **Database:** Create a free Postgres database on Neon.
- Set `DATABASE_URL` and `NEXT_PUBLIC_BASE_URL` as environment variables in your hosting provider.
- Point `NEXT_PUBLIC_BASE_URL` to your production URL (e.g. `https://tinylink-yourname.vercel.app`).

## Development Notes

- Database access is done via a shared `pg` connection pool in `lib/db.js`.
- Link-related helpers live in `lib/links.js`.
- UI components for the dashboard live in `app/CreateLinkForm.jsx` and `app/LinksTable.jsx`.
- The app uses Next.js App Router API route handlers under `app/api/*`.
