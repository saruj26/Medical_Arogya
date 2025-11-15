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
  - `frontend/app/customer/` — customer-facing pages (dashboard, profile, browse)
  - `frontend/app/customer/appointment/` — appointment list and detail
  - `frontend/app/customer/browse/` — doctors browse and filters
  - `frontend/components/booking/` — calendar helpers (CalendarGrid)
  - `frontend/lib/api.ts` — API URL helper

---

## Quick Setup (Local)

Run these commands in PowerShell on Windows. For macOS/Linux adjust venv activation accordingly.

1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

Notes

- Backend default: `http://127.0.0.1:8000`. Configure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` when necessary.
- Use PostgreSQL in production and secure your Django secret key.

## Environment & Config

Frontend `.env.local` example:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend example (use environment secrets in production):

```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

---

## API Reference (overview)

Key endpoints (mounted under `/api/`):

- `POST /api/auth/login/` — login (JWT)
- `POST /api/auth/change-password/` — change password
- `GET /api/user/profile/` and `PUT /api/user/profile/` — profile
- `GET /api/appointment/appointments/` — list appointments
- `GET /api/appointment/appointments/<id>/` and `PUT` — appointment detail & update
- `GET /api/appointment/prescriptions/` and download endpoint

Use the `api()` helper in `frontend/lib/api.ts` to build requests.

---

## Developer Notes & Conventions

- Time handling: frontend converts AM/PM selections to `HH:MM:SS` string format for backend `TimeField`.
- Always use `frontend/lib/api.ts` so the app respects `NEXT_PUBLIC_API_URL` in different environments.
- Calendar: `frontend/components/booking/calendar.tsx` (CalendarGrid) highlights doctor-available dates — prefer it for booking flows.

---

## Medical Assistant (chat)

The project includes a lightweight Medical Assistant for general guidance (non-diagnostic).

- UI: `frontend/app/customer/chat/page.tsx`
- Backend handlers (if present): `backend/chat/`

Disclaimer: This assistant provides information only and should not be used for emergency or diagnostic decisions. Add clear in-app disclaimers and request explicit consent if storing transcripts.

---

## Contributing

Contributions are welcome. Suggested flow:

1. Fork and create a branch (`feature/...` or `fix/...`).
2. Run linters/tests and update migrations if required.
3. Open a PR with a clear description and screenshots.

---

## License

No license file is included by default. Add a `LICENSE` (MIT recommended) to open-source the project.

---

If you want, I can add:

- `LICENSE` (MIT) file
- Example `.env.local` files in `frontend/` and `backend/`
- Small README files inside `backend/` and `frontend/` with per-folder run commands

Happy building! 🚀
