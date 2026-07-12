# AppSec Security Command Center

AppSec is a professional, portfolio-ready Full-Stack Cybersecurity SaaS platform designed to perform static vulnerability telemetry audits and NLP-based app store reviews sentiment mining.

The system is split into a **Next.js frontend** (TypeScript, Tailwind CSS v4, Recharts) and a **secure Node.js/Express backend** (TypeScript, Prisma, SQLite, JWT Auth, Helmet, Rate Limiter).

---

## Key Features

1. **Multi-Target Telemetry Auditing**:
   - **Google Play Store & iOS App Store Apps**: Analyzes requested permissions, SDK integrations, metadata, and review patterns.
   - **Web Applications**: Audits DNS configurations, SSL/TLS handshakes, HTTP security headers (CSP, HSTS, XSS protection), and session configurations.
   - **REST APIs**: Scans authentication parameters, TLS downgrade options, CORS parameters, and exception verbosity.
2. **AI Threat Diagnostics & Emulation**:
   - Deep NLP review analytics (calculates sentiment index, fake review bot density, rating timing anomalies).
   - Core Gemini AI API SDK integration (using `GEMINI_API_KEY`).
   - Advanced offline rule-based AI security emulator fallback that generates realistic CVE/CWE logs and remediation recipes.
3. **Enterprise-Grade Security Hardening**:
   - Input payload validation using strict `Zod` schemas.
   - Password encryption using `bcrypt` (10 rounds).
   - Security headers using `helmet` and strict `cors` controls.
   - Abuse protection using IP rate limiting (`express-rate-limit`).
   - Secure stateless JWT session token authentication.
4. **Rich Interactive Dashboard**:
   - Real-time visualizations utilizing Recharts (Radar, Bar, Pie charts).
   - Interactive vulnerability inspector displaying description logs and copyable code fixes.
   - Review sentiment telemetry gauges and keyword feeds.

---

## Project Architecture

```
/
├── backend/
│   ├── prisma/             # Schema & local SQLite DB migrations
│   ├── src/
│   │   ├── config/         # Prisma Client instantiator
│   │   ├── controllers/    # Auth, Scan, and Dashboard API logic
│   │   ├── middleware/     # JWT Auth, Zod Validation, Rate Limiters
│   │   ├── routes/         # Express endpoint mappings
│   │   ├── services/       # AI (Gemini), Emulator, and Web Scanner engines
│   │   └── app.ts          # Express application entry point
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router (Layouts & routing shell)
│   │   ├── components/     # Views (Dashboard, Scans, Sentiment, Auth) & UI items
│   │   ├── services/       # Fetch API wrapper
│   │   └── types/          # TypeScript interfaces
│   ├── Dockerfile
│   └── next.config.ts
├── docker-compose.yml      # Service link orchestrator
└── API_DOCS.md             # REST API endpoint definitions
```

---

## Getting Started

### 1. Locally (Manual Setup)

#### A. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy environment variables and insert your key (optional):
   ```bash
   copy .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run migrations and seed default database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Spin up the dev backend (ports `5000`):
   ```bash
   npm run dev
   ```

#### B. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (ports `3000`):
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) and authenticate using the demo credentials:
   - Email: `demo@appsec.io`
   - Password: `demo123`

---

### 2. Using Docker Compose (Recommended)

To run the complete application inside isolated containers, spin up the compose script from the root workspace:

```bash
docker-compose up --build
```

The frontend will be available at [http://localhost:3000](http://localhost:3000) and the backend REST API at [http://localhost:5000/api](http://localhost:5000/api).

---

## Deployment Guide

### Frontend (Vercel)
The Next.js frontend is fully compatible with Vercel deployment:
1. Link your repository on Vercel.
2. Add the environment variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend endpoint URL (e.g. `https://api.appsec-saas.com`).
3. Deploy. Standalone assets and static components will build automatically.

### Backend (Render / Heroku / AWS ECS)
1. Deploy the backend Node application or Docker container.
2. Add the environment variables:
   - `PORT`: Set by the cloud host provider.
   - `DATABASE_URL`: Swappable database URI (e.g., connection string for PostgreSQL / MySQL).
   - `JWT_SECRET`: A secure signing key.
   - `GEMINI_API_KEY`: Your Gemini API developer key.
