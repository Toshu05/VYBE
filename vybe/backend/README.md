# VYBE API (stage 1)

FastAPI + SQLAlchemy. SQLite by default, PostgreSQL via `DATABASE_URL`.

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then edit it, and export the variables
export JWT_SECRET=$(python -c "import secrets;print(secrets.token_urlsafe(48))")
export ALLOWED_EMAIL_DOMAIN=your-college-domain.example
ADMIN_EMAIL=you@your-college-domain.example ADMIN_PASSWORD='a-long-password' python -m app.seed
uvicorn app.main:app --reload   # docs at http://localhost:8000/docs
python -m pytest                # run the tests
```

## What is implemented and tested
Signup restricted to the college domain, Argon2 password hashing, JWT login (30 min), login throttling, roles (student, rep, faculty, admin) checked on the server for every protected route, per-club permissions, event lifecycle (draft, submitted, changes, published), faculty review with required notes, registration with capacity, duplicate protection and waitlist promotion, HMAC-derived pass codes, check-in with duplicate-scan blocking, certificates only for checked-in students, public verification, revocation.

## Not implemented yet (do not deploy publicly without these)
- Email verification and password reset (accounts are not verified yet)
- Refresh tokens, rate limiting beyond login, audit log
- Alembic migrations (tables are created on start)
- Campaign QR tracking, analytics, notifications, AI
- The web UI in `../index.html` still uses browser storage; it is not connected to this API yet.
