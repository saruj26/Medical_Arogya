<!--
	Professional README for Medical_Arogya
	Polished version with usage, advantages and developer notes
-->

# Medical_Arogya

> ⚕️ Arogya — Medical Appointment Booking & Patient Portal

Medical_Arogya is a full-stack platform that helps clinics and healthcare providers manage doctor profiles, availability and patient appointments. It pairs a Django REST backend with a Next.js + Tailwind frontend and includes core features for patients, doctors and administrators.

---

✨ Highlights

- ✅ Availability-aware booking and appointment management
- ✅ Doctor profiles, specialties and searchable browse
- ✅ Patient profile, prescriptions and appointment history
- ✅ Built-in Medical Assistant (chat) for guided, non-diagnostic assistance
- ✅ JWT-backed API and clean frontend/backend separation

---

## Table of Contents

- [Why Arogya?](#why-arogya)
- [Advantages](#advantages)
- [Technical Stack](#technical-stack)
- [Feature Status](#feature-status)
- [Project Layout](#project-layout)
- [Quick Setup (Local)](#quick-setup-local)
- [Environment & Config](#environment--config)
- [API Reference (overview)](#api-reference-overview)
- [Developer Notes & Conventions](#developer-notes--conventions)
- [Medical Assistant (chat)](#medical-assistant-chat)
- [Contributing](#contributing)
- [License](#license)

---

## Why Arogya?

Many clinics and small healthcare providers still rely on manual scheduling and phone calls. Arogya simplifies the patient journey by providing an integrated booking flow, doctor availability management, and patient-facing tools — all in a lightweight, extensible codebase suitable for prototyping and production.

## Advantages

- 🔒 Secure: Django provides robust security defaults; JWT supports modern client auth flows.
- ⚡ Rapid UI development: Next.js + Tailwind enables a fast, responsive interface.
- 🔁 Extensible: Built to accept integrations (payments, calendar sync, notifications).
- 🧪 Testable: Backend organization supports unit tests for models, serializers and views.

## Technical Stack

- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Django, Django REST Framework
- Database: SQLite (development) — PostgreSQL recommended for production
- Authentication: JWT (SimpleJWT) + Django auth for admin UI
- Utilities: SweetAlert2, custom CalendarGrid / react-day-picker

---

## Feature Status

Implemented

- Customer registration, login and profile management
- Doctor profiles and availability
- Appointment booking, listing and detail pages
- Change-password API and frontend form
- Prescription listing and PDF download
- Medical Assistant (chat UI)

Planned / Optional

- Payment integration (Stripe, Razorpay, etc.)
- External calendar sync (Google Calendar)
- SMS / Email reminders (Twilio, SendGrid)

---

## Project Layout

Top-level folders:

- `backend/` — Django project and apps
- `frontend/` — Next.js application

Important files and folders:

- Backend

  - `backend/backend/urls.py` — mounts `/api/` and admin
  - `backend/appointment/` — appointment models, serializers, views
  - `backend/core/` — authentication, profile and change-password

- Frontend

  # Medical_Arogya

  ⚕️ Arogya — Medical Appointment Booking & Patient Portal

  Medical_Arogya is a full-stack application that enables clinics and healthcare providers to manage doctor profiles, availability, and patient appointments. The project pairs a Django REST backend with a Next.js + Tailwind frontend and contains core features for patients, doctors, pharmacists and administrators.

  This README contains practical setup and troubleshooting notes for local development and deployment.

  --

  ## Table of Contents

  - [Tech stack](#tech-stack)
  - [Quick start (local)](#quick-start-local)
  - [Frontend (pnpm / Next.js)](#frontend-pnpm--nextjs)
  - [Backend (Django)](#backend-django)
  - [Environment variables](#environment-variables)
  - [API overview](#api-overview)
  - [Common issues & troubleshooting](#common-issues--troubleshooting)
  - [Testing & linting](#testing--linting)
  - [Deployment (Vercel) notes](#deployment-vercel-notes)
  - [Project structure & important files](#project-structure--important-files)
  - [Contributing](#contributing)
  - [License](#license)

  --

  ## Tech stack

  - Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
  - Backend: Django, Django REST Framework
  - DB (dev): SQLite (production: PostgreSQL recommended)
  - Auth: JWT (SimpleJWT) for API; Django admin for staff users

  --

  ## Quick start (local)

  Prerequisites

  - Python 3.10+ (3.11 recommended)
  - Node.js 20+ and pnpm (v8/10 recommended). You can use `npx pnpm@10` if pnpm is not globally installed.

  1. Backend (Django)

  ```powershell
  cd backend
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  python manage.py migrate
  # optional: create superuser for admin
  python manage.py createsuperuser
  python manage.py runserver 0.0.0.0:8000
  ```

  2. Frontend (Next.js)

  We use pnpm to install dependencies and build the Next app.

  ```powershell
  cd frontend
  pnpm install
  pnpm dev
  # open http://localhost:3000
  ```

  Notes

  - The frontend reads the API base from `NEXT_PUBLIC_API_URL` (see Environment section). If not set, it defaults to `http://localhost:8000`.
  - If native modules (e.g. `sharp`) require approval during installation, run `pnpm approve-builds` and approve when prompted.

  --

  ## Frontend (pnpm / Next.js)

  - Install: `pnpm install` (or `npx pnpm@10 install`)
  - Run dev: `pnpm dev`
  - Build production: `pnpm build`
  - Start production: `pnpm start` (if `start` script is configured by your deployment)

  If you see errors about the lockfile on CI (e.g., Vercel) — regenerate `pnpm-lock.yaml` locally using the same pnpm version and commit it.

  --

  ## Backend (Django)

  - Run migrations: `python manage.py migrate`
  - Create test data / fixtures: add fixtures or run scripts under `backend/` as needed
  - Run tests: `python manage.py test`

  When deploying to production, use a proper WSGI/ASGI server (Gunicorn/uvicorn), configure static files, and switch the DB to PostgreSQL.

  --

  ## Environment variables

  Frontend: create `frontend/.env.local` with:

  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

  Backend: set secure production values (example `.env` keys):

  ```
  DJANGO_SECRET_KEY=your-secret-key
  DEBUG=False
  DATABASE_URL=postgres://user:pass@host:5432/dbname
  EMAIL_HOST=smtp.example.com
  EMAIL_PORT=587
  EMAIL_HOST_USER=you@example.com
  EMAIL_HOST_PASSWORD=supersecret
  DEFAULT_FROM_EMAIL=you@example.com
  ```

  --

  ## API overview

  Important endpoints (mounted under `/api/` via `backend/core/urls.py`):

  - `POST /api/auth/register/` — register user
  - `POST /api/auth/login/` — login (returns access token)
  - `POST /api/auth/forgot-password/` — request OTP for password reset
  - `POST /api/auth/verify-otp/` — verify OTP (doesn't consume OTP)
  - `POST /api/auth/reset-password/` — reset password (consumes OTP)
  - `POST /api/auth/change-password/` — change password (authenticated)
  - `GET/PUT /api/user/profile/` — get or update profile
  - `GET /api/appointment/appointments/` — list appointments
  - `GET/PUT /api/appointment/appointments/<id>/` — appointment detail & update

  Use `frontend/lib/api.ts` to construct the base URL for requests:

  ```ts
  import api from '@/lib/api'
  fetch(api('/api/auth/change-password/'), ...)
  ```

  --

  ## Common issues & troubleshooting

  - Next prerender errors (hooks used in server components):

    - Error: "useSearchParams() should be wrapped in a suspense boundary" — Solution: move calls to `useSearchParams`, `usePathname`, or other client-only hooks into `"use client"` components, or wrap the client component in a server wrapper that uses `Suspense`.

  - pnpm & lockfile problems on CI (Vercel):

    - If Vercel fails with a frozen lockfile error, regenerate `pnpm-lock.yaml` locally with the same pnpm version, commit it, and push. Alternatively, configure the Vercel build to allow non-frozen installs temporarily.

  - Native build scripts (sharp) blocked during install:

    - Run `pnpm approve-builds` when prompted and approve `sharp`.

  - Missing types or module resolution in TypeScript:

    - Ensure `node_modules` is installed (pnpm), and that dev dependencies with types (e.g., `@types/*`) are present if a library doesn't bundle types.

  - Webpack/Next internal loader resolution errors (pnpm hoisting issues):
    - Remove `node_modules` and `.next`, reinstall with pnpm, and ensure the exact `next` version used in CI matches local:

  ```powershell
  Remove-Item -Recurse -Force .next,node_modules -ErrorAction SilentlyContinue
  pnpm install
  pnpm build
  ```

  --

  ## Testing & linting

  - Backend tests: `python manage.py test`
  - Frontend type check (if configured): `pnpm build` (Next will skip typecheck in some configs); or run `pnpm tsc --noEmit` if TypeScript config exists.
  - Linting: run any configured linters (ESLint/Prettier) as configured in the repo.

  --

  ## Deployment (Vercel) notes

  - Ensure the repo pushed contains `pnpm-lock.yaml` and `package.json` in the `frontend/` folder.
  - Vercel uses the lockfile by default (frozen). If you regenerate the lockfile locally, commit and push it before deploying.
  - Set environment variables in the Vercel project settings (e.g., `NEXT_PUBLIC_API_URL`, any secrets required by the app).
  - If a native dependency requires approval (e.g., `sharp`), approve locally, commit the lockfile, and push.

  --

  ## Project structure & important files

  - `backend/` — Django project, apps and API

    - `backend/core/` — authentication, profile, password flows
    - `backend/appointment/` — appointments and prescriptions

  - `frontend/` — Next.js app (App Router)
    - `frontend/app/` — pages grouped by route (customer, doctor, pharmacist, admin)
    - `frontend/components/` — shared UI components and primitives
    - `frontend/lib/api.ts` — helper to build API URL using `NEXT_PUBLIC_API_URL`

  --

  ## Contributing

  Contributions welcome. Suggested flow:

  1. Fork the repository and create a branch: `git checkout -b feature/my-feature`
  2. Run backend & frontend locally, add tests where appropriate.
  3. Open a PR with a clear description, screenshots and migration notes (if any).

  Please follow the existing code style and naming conventions in the repo.

  --

  ## License

  This repository doesn't include a license file by default. If you plan to open-source it, add a `LICENSE` file (MIT is a common choice).

  --

  If you'd like, I can also:

  - add a `LICENSE` (MIT) file
  - create per-folder READMEs for `backend/` and `frontend/` with more granular commands
  - scan the repo for client-only hooks (`useSearchParams`, `usePathname`) and prepare PR-style patches to fix any remaining prerender issues

  If you want any of those follow-ups, tell me which and I will implement them.
