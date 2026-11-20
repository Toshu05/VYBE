# Roadmap

## Next: real backend (M0/M1)
- FastAPI + PostgreSQL + SQLAlchemy, Alembic migrations
- Email-domain signup with verification, JWT access + rotating refresh tokens, Argon2id
- Server-side RBAC with per-club permissions; seeded super admin (no public admin signup)
- Move events, registrations (row-locked capacity), approvals and certificates to the database
- Replace `localStorage` in `js/app.js` with an API client

## Then: promotion layer
- Redirect QR codes (`/q/<code>`) per campaign channel, with scan logging
- Poster templates and classroom slides
- Campaign analytics from real tracked data
- Notice-board screens authenticated by revocable screen tokens

## Later
- Notifications (in-app, email, web push) with preferences and rate limits
- Rule-based recommendations; AI description and promotion-strategy helpers (optional, provider-agnostic)
- Heatmap, club collaboration, volunteers, sponsorship, multi-college support

## Open decisions
- College email domain
- Student roster import
- Certificate template and signatory
