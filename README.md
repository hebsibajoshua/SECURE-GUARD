# SecureGuard — Security Guard Management System

A full-stack mini project for managing security guard operations: companies raise duty
requests, an admin reviews and assigns guards, and guards check in/out to record attendance.

**Stack:** React + Vite + Tailwind CSS + Framer Motion (frontend) · Django + Django REST
Framework + JWT + SQLite (backend)

---

## 1. Folder Structure

```
secureguard/
├── backend/                  Django REST API
│   ├── config/                project settings, urls, wsgi/asgi
│   ├── users/                  custom User model (admin/company/guard roles) + JWT login
│   ├── companies/               Company profiles
│   ├── guards/                   Guard roster
│   ├── guard_requests/            GuardRequest + Assignment workflow
│   ├── attendance/                 Check-in / check-out records
│   ├── requirements.txt
│   └── manage.py
└── frontend/                 React app
    └── src/
        ├── components/        reusable UI (Card, Badge, Sidebar bits, Spinner, etc.)
        ├── layouts/             DashboardLayout (sidebar + topbar, shared by all roles)
        ├── pages/
        │   ├── admin/            Admin dashboard, Guards, Companies, Requests, Attendance
        │   ├── company/          Company dashboard, New Request, My Requests
        │   ├── guard/            Guard dashboard (Today's Duty), Attendance history
        │   ├── Landing.jsx       animated marketing page
        │   ├── Login.jsx / Register.jsx
        │   └── NotFound.jsx
        ├── hooks/                useAuth
        └── services/             api.js (axios + JWT refresh), auth.js, resources.js
```

---

## 2. Backend Setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Copy .env.example to .env, then replace DJANGO_SECRET_KEY with a generated value.
# Windows: copy .env.example .env
# Generate a key with: python -c "import secrets; print(secrets.token_urlsafe(50))"

python manage.py migrate

# Optional but recommended — creates demo Admin/Company/Guard logins + sample data
python manage.py seed_data

python manage.py runserver
```

The API runs at `http://127.0.0.1:8000/`. Admin panel: `http://127.0.0.1:8000/admin/`.
Migration files are included. Run `python manage.py check` and `python manage.py test`
to verify the backend. Do not commit the local `.env` file.

### Demo logins (created by `seed_data`)
| Role    | Email                     | Password   |
|---------|---------------------------|------------|
| Admin   | admin@secureguard.com     | admin123   |
| Company | company@secureguard.com   | company123 |
| Guard   | guard@secureguard.com     | guard123   |

If you'd rather create your own admin: `python manage.py createsuperuser`
(you'll be prompted for username, email, password — then set `role='admin'` for that
user from the Django admin panel or shell).

---

## 3. Frontend Setup (React)

```bash
cd frontend
npm install
cp .env.example .env       # already points at http://127.0.0.1:8000/api by default
npm run dev
```

The app runs at `http://localhost:5173/`. Make sure the Django server (step 2) is running
at the same time — the frontend calls it directly.

---

## 4. Core Workflow

1. A company registers (`/register`) and waits for admin approval before submitting a
   guard request (location, shift, number of guards, date, gender preference, notes).
2. The admin reviews pending requests, approves/rejects them, and assigns available
   guards to each request.
3. The guard logs in, sees today's duty on their dashboard, and checks in / checks out.
4. Once duty is done, the admin marks the request **Completed**, attendance is already
   recorded, and the assigned guards become available again for new requests.

---

## 5. Notes for the Mini Project Report

- **Authentication:** JWT (access + refresh tokens) via `djangorestframework-simplejwt`.
  Tokens are stored in `localStorage` on the frontend and auto-refreshed via an axios
  interceptor in `services/api.js`.
- **Role-based access:** every user has a `role` field (`admin` / `company` / `guard`).
  The backend restricts querysets and actions in each `views.py`; the frontend wraps
  routes in `<ProtectedRoute allowedRoles={[...]}>`.
- **Database tables:** User, Company, Guard, GuardRequest, Assignment, Attendance — see
  the `models.py` file in each backend app.
- **Theme:** dark UI (`#050505` background / `#121212` cards / royal blue `#2563EB`
  accent) defined in `frontend/tailwind.config.js`.
