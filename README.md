# ArenaAssist 2026

ArenaAssist 2026 is a GenAI-enabled stadium companion application designed for the FIFA World Cup 2026. It enhances stadium operations and the matchday tournament experience for fans, volunteers, venue staff, and command organizers.

The solution features real-time crowd management routing, an AI match scheduler, concessions pre-ordering, sustainability gamification, live chat assistance powered by Gemini, and dispatch incident triaging.

---

## Features

- **🧠 GenAI Smart Companion**: Direct support for stadium policies, gate logistics, accessibility, transit routing, and translations.
- **📅 AI Match Scheduler**: Auto-generates recovery-safe, conflict-free match trees with customizable rest-day policies.
- **🌭 Arena Concessions pre-orders**: Pre-order meals with interactive queues, including a sustainability check to reward fans with Eco-Points.
- **🗺️ Wayfinding & Gate Telemetry**: Real-time traffic heatmaps, elevator-routing for accessibility needs, and live queue estimates.
- **🚨 Incident Dispatch Dashboard**: Operations ticket triaging, size-validated image reporting, and live dispatch timeline progress tracking.

---

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Suhani-Tyagi/CookieCodes-promptwar.challenge4-.git
   cd CookieCodes-promptwar.challenge4-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Environment Variables

Configure these variables in your deployment settings (e.g. Vercel) or your local environment:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `SECURITY_PASSCODE` | Safe passcode required for administrative access | `MySecurePasscode2026` |
| `ALLOWED_ORIGINS` | Comma-separated list of origins permitted to call API routes | `https://my-app.vercel.app,http://localhost:5173` |
| `GEMINI_API_KEY` | Live Gemini model token for production queries | `AIzaSy...` |

---

## Development Operations

### Start Local Dev Server
```bash
npm run dev
```

### Build Production Bundle
```bash
npm run build
```

### Run Vitest Tests
```bash
npm test
```

### Run Code Quality Linter
```bash
npm run lint
```