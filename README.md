# MediSync.ai — Healthcare, Connected by Intelligence

An AI-powered healthcare platform built with **Next.js 15 App Router**, featuring intelligent conversations, smart scheduling, real-time queue tracking, and report intelligence.

## Features

- **AI Health Assistant** — Chat-based interface with contextual healthcare responses
- **Smart Report Intelligence** — AI-powered summaries for medical reports
- **Real-Time Queue Tracking** — Live queue position and estimated wait times
- **Appointment Management** — Multi-step booking wizard with specialty/doctor/time selection
- **Three Role-Based Portals**:
  - **Patient Portal** — Dashboard, AI assistant, appointments, reports, prescriptions, queue, notifications, profile
  - **Doctor Portal** — Patient roster, patient details, reports review, appointments, queue management
  - **Admin Portal** — System analytics with charts (Recharts), patient/doctor management, settings
- **Dark Mode** — Full dark/light theme toggle
- **Responsive Design** — Mobile-first with adaptive layouts
- **Framer Motion Animations** — Smooth transitions and micro-interactions

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with file-based routing |
| React 19 | UI library |
| Tailwind CSS v4 | Utility-first styling with `@theme` design tokens |
| Framer Motion | Animations and interactions |
| Lucide React | Icon library |
| Recharts | Data visualization (admin dashboard) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Demo Accounts

Click the role buttons on the login page to quickly access each portal:

| Role | Portal |
|---|---|
| Patient | `/patient` |
| Doctor | `/doctor` |
| Admin | `/admin` |

## Project Structure

```
app/
├── page.jsx                 # Landing page
├── layout.jsx               # Root layout
├── globals.css              # Design system & theme tokens
├── login/ signup/ forgot-password/
├── patient/                 # 8 patient portal pages
├── doctor/                  # 6 doctor portal pages
└── admin/                   # 7 admin portal pages

components/
├── ui/                      # 9 reusable UI primitives
├── layout/                  # Dashboard shell, sidebar, topbar, mobile nav
├── landing/                 # Landing page sections
└── providers/               # Client-side providers

context/                     # Auth & Theme contexts
lib/                         # Mock data & utilities
services/                    # API service layer
```

## License

MIT
