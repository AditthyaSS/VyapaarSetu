<div align="center">

# AIAtlas

**The open, real-time map of the AI ecosystem.**

A community-maintained directory of every AI model, tool, API, and GitHub repo —
with live pricing, benchmarks, and community reviews.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase)](https://supabase.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://aiatlas.dev) · [Report a Bug](https://github.com/your-org/aiatlas/issues) · [Request a Feature](https://github.com/your-org/aiatlas/issues)

</div>

---

## What is AIAtlas?

AIAtlas is an open-source, community-driven directory that tracks the AI ecosystem in real time. Anyone can sign in with GitHub and contribute — add a new model, update pricing, or leave a review. Changes are reflected live across all connected clients via Supabase Realtime.

**Why it exists:** The AI landscape moves faster than any single team can track. AIAtlas is built on the premise that the community, collectively, is always faster.

---

## Features

| Feature | Status |
|---|---|
| Model leaderboard — sortable by benchmark, price, speed, context | ✅ Live |
| Model detail pages — specs, benchmarks, pricing, modalities | ✅ Live |
| Table & card view toggle | ✅ Live |
| Filter by provider, modality, license, open-source | ✅ Live |
| Live activity feed — Supabase Realtime | ✅ Live |
| Dark / light mode with persistence | ✅ Live |
| GitHub OAuth sign-in | ✅ Live |
| Community contribution form | ✅ Live |
| Community reviews with star ratings | ✅ Live |
| Mobile-responsive navbar | ✅ Live |
| Tools directory | 🔜 v2 |
| Repos directory with GitHub sync | 🔜 v2 |
| ⌘K search command palette | 🔜 v2 |
| User profile pages | 🔜 v2 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + custom design system |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Realtime | [Supabase Realtime](https://supabase.com/realtime) (postgres_changes) |
| ORM | [Prisma](https://prisma.io) |
| Auth | [NextAuth.js](https://next-auth.js.org) + GitHub OAuth |
| Fonts | [Geist](https://vercel.com/font) (Sans + Mono) |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [GitHub OAuth App](https://github.com/settings/developers)

### 1. Clone and install

```bash
git clone https://github.com/your-org/aiatlas.git
cd aiatlas
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
# Supabase — from your project's API settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database — from Supabase → Settings → Database → Connection string
# Use the transaction-mode pooler URL for DATABASE_URL
DATABASE_URL=postgresql://postgres.[ref]:[password]@[host]:6543/postgres?pgbouncer=true
# Use the session-mode pooler URL for DIRECT_URL (migrations)
DIRECT_URL=postgresql://postgres.[ref]:[password]@[host]:5432/postgres

# GitHub OAuth — from github.com/settings/developers
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_SECRET=run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 3. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed with initial model data
npx prisma db seed
```

### 4. Enable Supabase Realtime

In your Supabase dashboard:
1. Go to **Database → Replication**
2. Enable replication for the `feed_events` table
3. Enable replication for the `models` table

### 5. Configure GitHub OAuth callback

In your GitHub OAuth App settings, set:
```
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The app runs fully on mock data without any credentials configured. Set up `.env` to enable database persistence, auth, and realtime features.

---

## Project Structure

```
aiatlas/
├── prisma/
│   ├── schema.prisma        # Database schema (11 models)
│   └── seed.ts              # Initial data (16 models, 8 providers)
├── src/
│   ├── app/
│   │   ├── api/             # API routes (models, feed, reviews, auth)
│   │   ├── auth/signin/     # GitHub OAuth sign-in page
│   │   ├── contribute/      # Contribution form page
│   │   ├── feed/            # Live activity feed page
│   │   ├── models/          # Models directory + detail pages
│   │   ├── repos/           # Repos directory (v2)
│   │   └── tools/           # Tools directory (v2)
│   ├── components/
│   │   ├── contribute/      # ContributeForm
│   │   ├── feed/            # FeedTicker
│   │   ├── layout/          # Navbar, Footer
│   │   ├── models/          # ModelTable, ModelCard, ModelFilters, ReviewSection
│   │   └── providers/       # SessionProvider, ThemeProvider
│   ├── hooks/
│   │   └── useLiveFeed.ts   # Realtime feed hook
│   ├── lib/
│   │   ├── mock-data.ts     # Fallback data (used when DB not connected)
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── realtime.ts      # Supabase Realtime subscriptions
│   │   ├── supabase.ts      # Supabase client (browser + server)
│   │   └── utils.ts         # Formatters, helpers
│   └── types/
│       └── index.ts         # TypeScript interfaces
└── .env.example             # Environment variable template
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/models` | List models. Supports `?search`, `?provider`, `?license`, `?modality`, `?sort`, `?limit`, `?offset` |
| `GET` | `/api/models/[slug]` | Get a single model by slug |
| `POST` | `/api/models` | Submit a new model (auth required) |
| `GET` | `/api/feed` | Get recent feed events. Supports `?limit` |
| `POST` | `/api/reviews` | Submit a review (auth required) |

---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/aiatlas)

1. Connect your GitHub repo to Vercel
2. Add all environment variables from `.env.example` in the Vercel dashboard
3. Update `NEXTAUTH_URL` to your production domain
4. Update your GitHub OAuth App callback URL to `https://yourdomain.com/api/auth/callback/github`
5. Deploy

Vercel automatically runs `prisma generate` via the build command. Make sure your `package.json` build script includes it, or add a `postinstall` script:

```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "next build"
}
```

---

## Contributing

We welcome contributions of all kinds — new models, bug fixes, features, and documentation improvements.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

Quick start:
```bash
git checkout -b feat/your-feature
# make changes
npm run build   # must pass
git push origin feat/your-feature
# open a pull request
```

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<div align="center">
Built with ❤️ by the community · <a href="https://github.com/your-org/aiatlas">Star us on GitHub</a>
</div>
