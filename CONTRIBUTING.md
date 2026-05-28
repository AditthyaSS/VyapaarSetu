# Contributing to AIAtlas

Thank you for helping keep the AI ecosystem map accurate and up to date. This guide covers everything you need to contribute — from a quick data fix to a full feature.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Submitting a New Model](#submitting-a-new-model)
- [Updating Existing Data](#updating-existing-data)
- [Code Contributions](#code-contributions)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Format](#commit-message-format)
- [Good First Issues](#good-first-issues)

---

## Code of Conduct

Be respectful, constructive, and welcoming. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Harassment, discrimination, or bad-faith contributions will not be tolerated.

---

## Ways to Contribute

| Type | How |
|---|---|
| Add a new AI model | Use the [/contribute](https://aiatlas.dev/contribute) form or open a PR |
| Fix outdated pricing | Open an issue or PR with the correct values |
| Fix a bug | Open an issue first, then a PR |
| Add a feature | Open an issue to discuss before building |
| Improve docs | Edit `README.md` or `CONTRIBUTING.md` directly |
| Report incorrect data | Open an issue with the label `data: incorrect` |

---

## Development Setup

### 1. Fork and clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/aiatlas.git
cd aiatlas
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Fill in your Supabase + GitHub OAuth credentials
# See README.md for the full setup guide
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

> The app works without credentials using built-in mock data. You only need a real database to test contribution and review flows.

---

## Project Structure

```
src/
├── app/api/          # API route handlers
├── app/(pages)/      # Page components
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, DB client, Supabase client
└── types/            # TypeScript interfaces
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Seed data
```

---

## Submitting a New Model

### Via the web form (easiest)

1. Go to [aiatlas.dev/contribute](https://aiatlas.dev/contribute)
2. Sign in with GitHub
3. Fill in the model details and submit
4. A maintainer will review and approve within 24 hours

### Via pull request

1. Open `prisma/seed.ts`
2. Add your model to the `modelData` array following the existing format:

```typescript
{
  slug: "model-name-slug",          // URL-safe, lowercase, hyphens
  name: "Model Display Name",
  providerId: providerMap["Provider Name"],
  contextWindow: 128000,            // in tokens
  inputPricePerMtok: 3.0,           // USD per million input tokens
  outputPricePerMtok: 15.0,         // USD per million output tokens
  benchmarkGpqa: 84.1,              // optional, 0-100
  benchmarkMmlu: 88.5,              // optional, 0-100
  license: "Proprietary",           // or "MIT", "Apache 2.0", etc.
  modalities: ["text", "image"],    // text, image, audio, video
  isOpenSource: false,
  parameterCount: "70B",            // optional
  speedToksPerSec: 72,              // optional, tokens/second
  isVerified: false,                // maintainers set this to true
  tags: ["coding", "balanced"],     // 1-3 descriptive tags
}
```

3. If the provider doesn't exist yet, add it to the `providers` array at the top of `seed.ts`
4. Open a PR with the title: `[model] Add <Model Name> by <Provider>`

**Required fields:** `slug`, `name`, `providerId`, `modalities`, `isOpenSource`

**Data quality checklist:**
- [ ] Pricing sourced from the official provider pricing page (include the URL in your PR description)
- [ ] Benchmark scores sourced from the official model card or paper
- [ ] Slug is unique and URL-safe
- [ ] No duplicate of an existing model

---

## Updating Existing Data

Pricing and specs change frequently. If you spot outdated data:

### Quick fix (preferred)

Open an issue with:
- **Title:** `[outdated] <Model Name> — <field name>`
- **Body:** The correct value and a link to the source

### Via PR

1. Update the relevant field in `prisma/seed.ts`
2. PR title: `[update] <Model Name> — <what changed>`
3. Include the source URL in the PR description

---

## Code Contributions

### Before you start

- Check [open issues](https://github.com/your-org/aiatlas/issues) to avoid duplicate work
- For significant changes, open an issue first to discuss the approach
- For bug fixes, reference the issue number in your PR

### Workflow

```bash
# Create a branch from main
git checkout -b feat/your-feature-name
# or
git checkout -b fix/bug-description

# Make your changes
# ...

# Verify the build passes
npm run build

# Check for type errors
npx tsc --noEmit

# Push and open a PR
git push origin feat/your-feature-name
```

### Code style

- Match the existing patterns — don't introduce new libraries without discussion
- Use TypeScript strictly — no `any` types
- Components go in `src/components/`, hooks in `src/hooks/`, API logic in `src/app/api/`
- Keep components focused — one responsibility per file
- All user-facing strings should be accessible (proper `aria-label`, semantic HTML)

### Adding a new API route

1. Create the file at `src/app/api/your-route/route.ts`
2. Export named functions: `GET`, `POST`, `PUT`, `DELETE`
3. Always validate auth for write operations using `getServerSession()`
4. Always validate input before writing to the database
5. Return consistent JSON: `{ data: ... }` for success, `{ error: "..." }` for errors

### Adding a new page

1. Create `src/app/your-page/page.tsx`
2. Use server components where possible (no `"use client"` unless you need interactivity)
3. Add the route to the `navLinks` array in `Navbar.tsx` if it belongs in the nav

---

## Pull Request Guidelines

- **One PR per concern** — don't mix a bug fix with a new feature
- **Fill in the PR template** — describe what changed and why
- **Link related issues** — use `Closes #123` in the PR description
- **Keep PRs small** — easier to review, faster to merge
- **Screenshots for UI changes** — attach before/after screenshots

### PR title format

```
[type] Short description

Types: feat, fix, data, docs, refactor, chore
```

Examples:
- `[feat] Add ⌘K search command palette`
- `[fix] Correct Gemini 2.5 Pro pricing`
- `[data] Add Llama 3.2 by Meta AI`
- `[docs] Update deployment instructions`

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Optional longer description.

Closes #123
```

Examples:
```
feat(models): add benchmark comparison chart
fix(auth): handle missing GitHub email gracefully
data: update GPT-4o pricing to $2.50/M input
docs: add Vercel deployment guide to README
```

---

## Good First Issues

New to the codebase? Look for issues tagged [`good first issue`](https://github.com/your-org/aiatlas/labels/good%20first%20issue) on GitHub.

Some ideas that are always welcome:
- Adding a newly released model to the directory
- Fixing a typo or improving documentation
- Adding a missing benchmark score
- Improving accessibility (ARIA labels, keyboard navigation)

---

## Questions?

Open a [GitHub Discussion](https://github.com/your-org/aiatlas/discussions) or drop a comment on any issue. We're happy to help.
