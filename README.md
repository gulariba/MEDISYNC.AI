# MediSync.ai — Healthcare, Connected by Intelligence

An AI-powered healthcare platform with a **Next.js 15** frontend and **FastAPI + PostgreSQL** backend. Features intelligent AI conversations, smart scheduling, real-time queue tracking, report intelligence, and full role-based access control.

## Features

- **JWT Authentication** — Login, register, session restore, automatic token refresh, role-based routing
- **AI Health Assistant** — Chat-based interface with contextual healthcare responses
- **Smart Report Intelligence** — AI-powered summaries for medical reports
- **Real-Time Queue Tracking** — Live queue position and estimated wait times
- **Appointment Management** — Multi-step booking wizard with specialty/doctor/time selection
- **Three Role-Based Portals**:
  - **Patient Portal** — Dashboard, AI assistant, appointments, reports, prescriptions, queue, notifications, profile
  - **Doctor Portal** — Patient roster, patient details, reports review, appointments, queue management
  - **Admin Portal** — System analytics with charts (Recharts), patient/doctor management, appointments, queue, settings
- **Dark Mode** — Full dark/light theme toggle
- **Responsive Design** — Mobile-first with adaptive layouts
- **Framer Motion Animations** — Smooth transitions and micro-interactions

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with file-based routing |
| React 19 | UI library |
| Tailwind CSS v4 | Utility-first styling with `@theme` design tokens |
| Framer Motion | Animations and interactions |
| Lucide React | Icon library |
| Recharts | Data visualization (admin dashboard) |

### Backend

| Technology | Purpose |
|---|---|
| FastAPI | Python REST API framework |
| PostgreSQL | Primary database |
| Redis | Caching and queue management |
| Docker Compose | Container orchestration |
| AI Agents | Triage, diagnosis, and scheduling agents |

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Docker** and **Docker Compose** (for PostgreSQL and Redis)

### 1. Clone the Repository

```bash
git clone https://github.com/gulariba/MEDISYNC.AI.git
cd MEDISYNC.AI
```

### 2. Start the Backend

```bash
cd medisync.ai-backend

# Option A: Docker Compose (recommended)
docker-compose up -d

# Option B: Manual
pip install -r requirements.txt
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at [http://localhost:8000](http://localhost:8000)
API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Start the Frontend

```bash
# From the project root
npm install
npm run dev
```

Frontend runs at [http://localhost:3000](http://localhost:3000)

### 4. Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Demo Accounts

Use these credentials on the login page, or click the role buttons for quick access:

| Role | Email | Password |
|---|---|---|
| Patient | `patient@medisync.demo` | `Demo@123` |
| Doctor | `doctor@medisync.demo` | `Demo@123` |
| Admin | `admin@medisync.demo` | `Demo@123` |

## Project Structure

```
MEDISYNC.AI/
├── app/                          # Next.js App Router pages
│   ├── page.jsx                  # Landing page
│   ├── layout.jsx                # Root layout
│   ├── globals.css               # Design system & theme tokens
│   ├── login/ signup/            # Auth pages
│   ├── patient/                  # 8 patient portal pages
│   ├── doctor/                   # 6 doctor portal pages
│   └── admin/                    # 7 admin portal pages
│
├── components/
│   ├── ui/                       # Reusable UI primitives
│   ├── layout/                   # Dashboard shell, sidebar, topbar
│   ├── landing/                  # Landing page sections
│   └── providers/                # Client-side providers
│
├── context/                      # Auth & Theme contexts (JWT)
├── lib/
│   ├── api/                      # API client & data adapters
│   └── mock-data/                # Fallback data
├── services/                     # API service layer
│
└── medisync.ai-backend/          # FastAPI backend
    ├── backend/
    │   ├── main.py               # FastAPI application entry
    │   ├── config.py             # Configuration
    │   ├── routes/               # API route handlers
    │   ├── agents/               # AI agents (triage, diagnosis, scheduling)
    │   ├── db/                   # Database models & connection
    │   ├── hooks/                # Enforcement hooks
    │   ├── middleware/           # Error handling middleware
    │   └── utils/                # Caching, logging, helpers
    ├── mock_data/                # Database schema & seed data
    ├── docker-compose.yml        # PostgreSQL + Redis + API
    └── requirements.txt          # Python dependencies
```

## API Architecture

The frontend communicates with the backend through a centralized API client:

```
Frontend UI  →  services/api/index.js  →  lib/api/client.js  →  FastAPI endpoints  →  Response  →  UI update
```

- **`lib/api/client.js`** — Centralized fetch with JWT token management, auto-logout on 401
- **`lib/api/adapters.js`** — Transforms backend snake_case responses to frontend camelCase
- **`services/api/index.js`** — Service layer with role-specific API methods
- **`context/AuthContext.jsx`** — JWT authentication context (login, register, session restore)

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server (port 3000) |
| `npm run build` | Build frontend for production |
| `npm start` | Start production frontend server |

## License

MIT
