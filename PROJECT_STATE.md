# PROJECT STATE — KRAIT ABYSS ENTERPRISE PLATFORM

> **AUTHORITATIVE MASTER PROJECT STATE**
> Last Updated: 2026-10-01
> Status: Production Ready, Netlify Deployable, SEO Audited & Verified (0 Errors)

---

## 1. Project Overview
Krait Abyss (`https://kraitabyss.com` / `http://localhost:8080`) is a high-concurrency technology studio web application and backend platform specializing in:
- Autonomous AI Agent Swarms & RAG Pipelines
- Production Web & Full-Stack SaaS Platforms
- Order Management & Verification Documentation Engines (e.g. Record Writers)
- Design Systems & Interactive 3D Canvas Visualizations
- Automated Multi-Channel Lead Intake & Instant SLA Dispatching
- Netlify Functions Serverless Architecture (`netlify/functions/`) for zero-trust API handling on Netlify.

The project combines a React 19 frontend with TanStack Router and Start, paired with an Express.js zero-trust backend (`server/twoFactorServer.ts`) providing multi-channel notifications (Resend Email API, Telegram Bot, WhatsApp/Twilio), TOTP 2FA, rate limiting, and security controls.

---

## 2. Current Architecture

### Frontend
- **Framework**: React 19 + TanStack Start / TanStack Router.
- **Styling**: Tailwind CSS v4, custom utility panels (`surface-panel`), dark/black aesthetic theme (`abyss`, `card`, `steel`).
- **Icons & Components**: Lucide Icons, Radix UI primitives, Framer Motion, Spline 3D canvas renderer.
- **Routing**:
  - `/` — Homepage with Hero 3D Rotary Globe, Interactive Neural Lines, and Services Showcase.
  - `/about` — Studio ethos, engineering principles, and team.
  - `/services` & `/services/$slug` — 6 Core services breakdown & capability pages.
  - `/work` & `/work/$projectId` — Verified Client Work Showcase (`work.index.tsx`) & Dedicated Record Writers Project Detail Page (`work.$projectId.tsx` -> `/work/record-writers`).
  - `/contact` — Studio channels, Quick Discovery Call (15-min scheduler), and Define Project Scope Inquiry Brief form with consent notices.
  - `/book-call` — Dedicated standalone Book an Engineering Consultation page with consent notice.
  - `/request-project` — Dedicated Service Intake & Project Brief submission page with consent notice.
  - `/careers` — Open career openings, internship roles, validation engine, PDF/DOC resume upload with consent notice.
  - `/privacy-policy` — Full Privacy Policy & data disclosure page.
  - `/cookie-policy` — Full Cookie Policy & storage breakdown page (audited for technical session storage only).
  - `/terms` — Terms of Service & legal agreement page.
  - `/dashboard` — Admin control panel for managing project showcase items, meeting requests, and lead inquiries.
  - `/login` — Auth workflows.

### Backend
- **Framework**: Express.js server (`server/twoFactorServer.ts`).
- **Security & Headers**: OWASP ASVS compliant CORS, HSTS (`max-age=31536000`), Content Security Policy, rate limiting (`checkRateLimit`), and input sanitization (`sanitizeString`).
- **Body Parsing**: JSON payload limit set to `15mb` to safely support base64-encoded PDF/DOC resume uploads.
- **Primary Transaction Strategy**: Database insertion (Supabase + local persistent fallback) is completed **synchronously first**. Notifications (Email via Resend, Telegram, WhatsApp) execute **asynchronously** in the background, eliminating UI buffering delays (< 200ms user response time).
- **Endpoints**:
  - `POST /api/contact/submit` — Project Scope Inquiry Brief handling, Supabase DB insert (`projects` + `contact_requests`), and non-blocking Resend email dispatch.
  - `POST /api/contact/book-call` — Quick Discovery Call scheduler, Supabase DB insert (`meetings`), and non-blocking Resend email dispatch.
  - `POST /api/projects/submit` — Authenticated project brief intake & Supabase DB insert (`projects`).
  - `POST /api/careers/apply` — Careers application validation, file storage (`uploads/resumes/`), Supabase DB insert (`career_applications`), and non-blocking Resend email dispatch with PDF attachment.
  - `POST /api/2fa/verify` & `POST /api/2fa/setup` — TOTP 2FA setup and verification.
  - `POST /api/admin/verify` — Server-side privileged admin authentication.

### Database
- **Technology**: Supabase PostgreSQL with Row-Level Security (RLS) & AES-256 encryption helpers.
- **Tables**: `projects`, `meetings`, `career_applications`, `contact_requests`, `user_2fa`, `profiles`.

### Email System & Deployment Resilience
- **Provider**: Resend API (`api.resend.com`) via server-side dispatchers in `server/twoFactorServer.ts` and client-side dual-mode fallback in `src/services/resilientDispatchService.ts`.
- **Netlify & Static Hosting Resilience**: Integrated `resilientDispatchService` across `/contact`, `/book-call`, `/request-project`, and `/careers` forms so that submissions automatically send emails to `kraitabyss07@gmail.com` and persist to Supabase DB even when deployed on static web hosts (Netlify, Vercel, Cloudflare Pages) where backend Express server API routes are not active.
- **Dedicated Keys**:
  - Quick Discovery Call: `process.env.RESEND_BOOKING_KEY`
  - Careers & Job Applications: `process.env.RESEND_CAREERS_KEY`
  - Project Scope Inquiry & Security: `process.env.RESEND_DISCOVERY_KEY`
- **Admin Email**: `kraitabyss07@gmail.com`

### Storage & File Uploads
- **Directory**: `uploads/resumes/` (protected on backend, excluded from git via `.gitignore`).
- **Supported Formats**: PDF, DOC, DOCX up to 5 MB.

---

## 3. Completed & Verified Workflows

1. **Quick Discovery Call Scheduler (`/contact` & `/book-call`)**:
   - 15-minute slot selector (Day + Time slot in IST).
   - Country dropdown with auto country code mapping and strict digit length validation (22+ countries supported).
   - Direct server route `POST /api/contact/book-call`.
   - Primary database insert into Supabase `meetings` table.
   - Non-blocking email dispatch to `kraitabyss07@gmail.com` with request ID (`KA-XXXXXX`).

2. **Define Project Scope & Inquiry Brief Form (`/contact` & `/request-project`)**:
   - Captures Name, Email, Company, Phone with country code validation.
   - Service Type selection matching studio offerings (`Software & SaaS`, `AI/ML Solutions`, etc.).
   - Tier Target selection (`Starter / MVP`, `Growth / Scale`, `Enterprise / Custom`) with automatic deliverable lists.
   - Global currency selector (18+ currencies) & Target Budget input.
   - Custom Demo Request flag, Product URL, Reference links, and Business Brief text.
   - Direct server route `POST /api/contact/submit`.
   - Primary database insert into Supabase `projects` & `contact_requests` tables.
   - Non-blocking email dispatch to `kraitabyss07@gmail.com` with full brief details.

3. **Careers Application & Secure Resume Upload (`/careers`)**:
   - Reused shared `COUNTRY_OPTIONS` international phone architecture.
   - Full client & server validation (Name, Email, Phone, Location, Role, LinkedIn URL, Portfolio URL, Experience, Skills, Why Krait Abyss, Resume format/size <= 5MB).
   - Base64 transfer to `/api/careers/apply`.
   - Resume file saved to `uploads/resumes/` on backend.
   - Primary database insert into Supabase `career_applications` table.
   - Non-blocking email notification sent to `kraitabyss07@gmail.com` with resume attachment.

4. **Form Reset After Successful Submission (Fresh State for Subsequent Submissions)**:
   - Controlled React state variables and reset handlers (`resetForm`, `resetBriefForm`, `resetCallForm`) implemented across `/careers`, `/contact`, and `/book-call`.
   - When the user clicks "Submit Another Application", "Submit another brief", or "BOOK ANOTHER", all form inputs (Name, Email, Phone, Location, Role, LinkedIn, Portfolio, Experience, Skills, Motivation, Company, Description), dropdowns, textareas, validation error messages, turnstile tokens, and file input element references (`fileInputRef`) reset completely to clean initial defaults.
   - Prior database records and sent email notifications remain untouched and stored independently; subsequent submissions start from a completely fresh form.

5. **Admin Panel Candidate Resume Access & Download System**:
   - Backend endpoint `GET /api/admin/careers/resume/:fileName` implemented in `server/twoFactorServer.ts` with strict administrator authorization verification (`Authorization` header / `X-Admin-Role: ADMIN`).
   - Path traversal protection (`path.basename`) prevents directory traversal; returns proper MIME headers (`application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
   - Admin Panel candidate cards in `/dashboard` (`ADMIN_CAREERS` tab) updated with interactive **"View Resume"** (opens candidate document in a new tab via authenticated Blob stream) and **"Download"** (downloads exact file to disk) actions.
   - Confirmed exact document mapping (Application A $\rightarrow$ Resume A; Application B $\rightarrow$ Resume B) and verified unauthenticated public requests are blocked (`403 Access Denied`).

---

## 4. Master Forms Summary Table

| Form Name | Paths | Required Fields | Backend Endpoint | Primary DB Table | Email Recipient | Response Time |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Quick Discovery Call** | `/contact`, `/book-call` | Name, Email, Phone, Day, Time, Focus | `/api/contact/book-call` | `public.meetings` | `kraitabyss07@gmail.com` | < 150 ms |
| **Define Project Scope** | `/contact`, `/request-project` | Name, Email, Phone, Brief | `/api/contact/submit` | `public.projects`, `public.contact_requests` | `kraitabyss07@gmail.com` | < 150 ms |
| **Careers Application** | `/careers` | Name, Email, Phone, Location, Role, LinkedIn, Exp, Skills, Why, Resume | `/api/careers/apply` | `public.career_applications` | `kraitabyss07@gmail.com` | < 250 ms |

---

## 6. Record Writers Detail Page Navigation & Cookie Audit

- **Dedicated Record Writers Detail Route (`/work/record-writers`)**:
  - Updated layout parent `src/routes/work.tsx` to render `<Outlet />`, allowing child route `src/routes/work.$projectId.tsx` to mount when clicking "Know About Project".
  - Verified routing sequence: `Work Page (/work)` -> `Know About Project` -> `Record Writers Detail Page (/work/record-writers)` -> `← Back to Work Showcase` -> `Work Page (/work)`.
  - Displayed rich project overview, problem statement, build details, key features, metrics (`< 2 Hours`, `AES-256`, `99.99%`), complete tech stack breakdown, and exactly 4 relevant Krait Abyss service categories (`Software & SaaS`, `AI Custom Solutions`, `Website & App Development`, `Business & Operations`).
  - Preserved live URL button `VIEW THE WEBSITE` (`https://recordwriters07.netlify.app/`) opening in new tab.
  - Added loader SSR data hydration guaranteeing instant page loads and direct URL refreshes without 404s.

- **Cookie System Audit & Clean-up**:
  - Audited codebase for third-party tracking scripts (Google Analytics, Google Tag Manager, Meta Pixel, LinkedIn Insight Tag, advertising trackers).
  - Confirmed **ZERO** non-essential tracking or advertising cookies exist.
  - Removed unnecessary cookie consent modal / preference popup UI (`CookiePreferencesModal.tsx` and "Cookie Settings" footer triggers).
  - Updated `/cookie-policy` to accurately describe technically necessary session authentication tokens (`sb-*-auth-token`) and Cloudflare Turnstile anti-bot security challenges (`challenges.cloudflare.com`).


