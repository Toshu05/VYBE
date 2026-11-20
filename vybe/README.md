# CampusConnect

**One Campus. Every Event. Everyone Connected.**

A centralized digital event engagement and promotional ecosystem engineered for **ABES Engineering College, Ghaziabad**, expandable to collegiate campuses across India.

---

## 🌟 The Core Innovation: Connecting Online Discovery with Offline Campus Promotion

College clubs typically rely on scattered WhatsApp messages, Instagram stories that vanish after 24 hours, and costly physical standees with zero ROI visibility. 

**CampusConnect** solves this by establishing a unified promotional and event lifecycle infrastructure:
1. **Attributed Dynamic QR Codes**: Every event receives campaign-tagged QR codes tracking physical promotional assets (standees, classroom visit slides, department noticeboards, Instagram stories, WhatsApp blasts).
2. **Projector-Ready Classroom Presentation Slides (16:9)**: Instant full-screen slides for student reps to project during lectures, featuring event highlights and a high-contrast registration QR.
3. **Social Media Promotional Kit Generator**: Automatically renders downloadable 1:1 Instagram posts, 9:16 vertical stories, and formatted WhatsApp broadcast copy.
4. **Digital Campus Noticeboard Kiosk Mode (`#/display`)**: Full-screen ambient display mode for campus televisions across Academic Blocks, automatically rotating upcoming events with live countdown timers and registration QR codes.
5. **Anti-Screenshot Cryptographic Passes**: Signed HMAC passes with pulsing animated security guards, real-time waitlists with auto-promotion, and sub-200ms QR check-in scanning.
6. **Faculty Governance & Automated Clash Detection**: Evaluates venue and time collisions within a $\pm 3$-hour window, eliminating scheduling conflicts between student clubs.
7. **Grounded AI Suite**: Generates structured promotional copy, multi-day marketing timelines, and factual event Q&A without hallucinations.

---

## 🏛️ Role-Based Access Control (RBAC)

| Role | Responsibilities & Capabilities |
|---|---|
| **Student** | Browse verified events, search/filter, follow clubs, register, join waitlists, view dynamic passes, export `.ics` calendars, download authentic certificates. |
| **Club Representative** | Manage club profile, create draft events, generate campaign QRs, view telemetry funnels, launch classroom slides & social kits, scan attendee passes, issue verified certificates. |
| **Faculty Coordinator** | Review queue, automated venue clash warnings, approve/request changes with notes, audit logs, certificate revocation. |
| **Super Administrator** | Institutional overview, verify new student societies, department management, system audit logs, global conversion metrics. |

---

## 🚀 Quick Start Guide

### 1. Frontend Web Portal
No complex build steps required. Serve the web application directly:

```bash
# From the vybe/ directory:
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

Alternatively, open `index.html` directly in any modern browser.

### 2. Backend FastAPI Core & Tests

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run complete test suite (Authentication, RBAC, Approvals, Campaigns, Conflicts, AI, Telemetry)
python -m pytest tests -v

# Start FastAPI production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Access Interactive Swagger Docs at: http://localhost:8000/docs
```

---

## 📁 Repository Structure

```
vybe/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application core, models, schemas & API endpoints
│   │   ├── seed.py              # Database seeding script for ABES demo environment
│   │   └── __init__.py
│   ├── tests/
│   │   ├── conftest.py          # Isolated test database fixture
│   │   ├── test_flow.py         # End-to-end auth, roles, approval & ticketing tests
│   │   └── test_campusconnect.py# Smart QR campaigns, conflicts, AI & analytics tests
│   ├── pytest.ini
│   ├── requirements.txt
│   └── README.md
├── css/
│   └── style.css                # Custom modern SaaS design tokens, components & kiosk styles
├── js/
│   └── app.js                   # Client-side router, state engine, QR generation & telemetry
├── index.html                   # Application shell & semantic layout
└── README.md                    # This document
```

---

## 🔒 Security & Verification Controls

- **Cryptographic Passes**: HMAC-SHA256 signature tokens ensure passes cannot be counterfeited or forged.
- **Duplicate Check-In Defense**: Database unique constraints guarantee that a pass cannot be scanned twice.
- **Race Condition Immunity**: Database-level `SELECT ... FOR UPDATE` row locks prevent overbooking beyond strict venue capacity limits.
- **Public Certificate Verification**: Any issued credential can be publicly verified at `#/verify/<CODE>` against institutional records.

---

## 📄 License & Institutional Recognition

Built for **ABES Engineering College (ABES), Ghaziabad**.  
Released under the MIT License.
