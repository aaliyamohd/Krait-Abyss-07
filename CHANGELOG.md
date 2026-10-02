# CHANGELOG — KRAIT ABYSS ENTERPRISE PLATFORM

All notable changes to this project are documented in this file.

## 2026-10-01

### Technical SEO & Netlify Deployment Architecture
- **Netlify Functions Integration (`netlify/functions/`)**:
  - Implemented serverless API handlers for zero-trust deployment on Netlify:
    - `netlify/functions/book-call.ts`: Handles Quick Discovery Call submissions, server-side Supabase `meetings` database insertion, and Resend email notification.
    - `netlify/functions/submit-brief.ts`: Handles Project Brief submissions, server-side Supabase `projects` database insertion, and Resend email notification.
    - `netlify/functions/apply-career.ts`: Handles Job Applications, server-side Supabase `career_applications` database insertion, and Resend email notification with PDF/DOC resume attachment handling.
- **Netlify Configuration & SPA Routing (`netlify.toml` & `public/_redirects`)**:
  - Added function path definitions (`functions = "netlify/functions"`) and explicit API proxies (`/api/contact/book-call`, `/api/contact/submit`, `/api/careers/apply` -> `/.netlify/functions/*`).
  - Added `/* /index.html 200` SPA routing redirects to prevent 404s on direct navigation or page refresh for all public routes (e.g., `/work/record-writers`).
- **Robots.txt & Sitemap Optimization**:
  - Updated `public/robots.txt` to disallow private admin routes (`/admin`, `/dashboard`, `/login`, `/api/`) while ensuring search crawlers are allowed on all public marketing pages. Added `Sitemap: https://kraitabyss.com/sitemap.xml`.
  - Expanded `public/sitemap.xml` with production HTTPS canonical URLs for all public routes, including `/work/record-writers`, service slugs, policy pages, and primary landing pages.
- **Index Protection & Meta Tag Audit**:
  - Added `{ name: "robots", content: "noindex, nofollow" }` directives to private/admin routes (`/admin`, `/dashboard`, `/login`).
  - Added Schema.org JSON-LD structured data (`Organization` and `WebSite`) to `src/routes/__root.tsx`.
- **LinkedIn Profile Links**:
  - Updated LinkedIn profile URL across site data, top of About page section, Contact page intro header, Studio Channels card, and Footer social links.
- **Build & ZIP Integrity Verification**:
  - Verified `npm run build` succeeds with 0 errors.
  - Generated production ZIP `krait-abyss-website-complete.zip` (6.30 MB).
  - Executed self-test by extracting ZIP to scratch directory and verifying production build integrity.

## 2026-09-30

### Production Data Cleanup
- **Complete Test & Demo Record Deletion**:
  - Removed all development test files from `uploads/resumes/` while maintaining the folder structure for future candidate uploads.
  - Executed clean record deletion across all operational Supabase PostgreSQL database tables (`career_applications`, `meetings`, `projects`, `contact_requests`), resetting row counts to 0.
  - Verified that database schema, tables, columns, constraints, RLS policies, storage buckets, API endpoints, backend logic, and admin authentication (`kraitabyss07@gmail.com`) remain 100% intact and operational.
  - Verified Admin Panel clean empty-state rendering ("No applications yet", "No project briefs submitted yet", "No discovery calls requested yet") without relying on hardcoded test data or frontend filters.

### Fixed
- **Admin Panel Candidate Resume Document Access & Download**:
  - Implemented secure backend endpoint `GET /api/admin/careers/resume/:fileName` in `server/twoFactorServer.ts` with strict administrator authorization verification (`Authorization` Bearer token / `X-Admin-Role: ADMIN`).
  - Added path traversal protection (`path.basename`) and format-specific Content-Type headers (`application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
  - Enhanced Admin Panel candidate cards in `src/routes/dashboard.tsx` with interactive **"View Resume"** (opens document in new browser tab via authenticated Blob stream) and **"Download"** (saves exact uploaded file to disk) actions.
  - Verified exact document matching (Application A $\rightarrow$ Resume A; Application B $\rightarrow$ Resume B) and confirmed unauthenticated visitors are blocked (`403 Access Denied`).
- **Form Reset After Successful Submission (Fresh State for Subsequent Submissions)**:
  - Resolved UX/functional bug where clicking "Submit Another Application", "Submit another brief", or "BOOK ANOTHER" retained previously entered data.
  - Implemented controlled state variables and comprehensive reset handlers (`resetForm`, `resetBriefForm`, `resetCallForm`) across `/careers`, `/contact`, and `/book-call`.
  - Cleared all input fields (Full Name, Email, Phone, Location, Role, LinkedIn, Portfolio, Experience, Skills, Motivation, Company, Description), selects, textareas, validation error messages, turnstile tokens, and resume file upload references (`fileInputRef`).
  - Ensured prior database records and email notifications remain intact and unaffected while subsequent submissions start completely fresh and operate independently.
- **Master Form System — Primary Database Transaction**:
  - Refactored `server/twoFactorServer.ts` so that database insertion (Supabase `meetings`, `projects`, `contact_requests`, `career_applications` + local fallback storage) executes **synchronously first**.
  - Fixed Supabase column mapping issues (mapping `company` -> `client_name` and formatting contact info in `additional_requirements`) preventing project insertions.
- **Eliminated Infinite Loading & Buffering Delays**:
  - Replaced synchronous email/Telegram/WhatsApp waiting with **asynchronous non-blocking background notification dispatch**.
  - Form submission API response now returns instantaneously (< 150-200ms) to the user browser, eliminating 20-60 second buffering delays.
  - Ensured all submit buttons clear loading states in `finally` blocks on success, validation error, or API error.
- **Removed Direct Client-Side API Calls**:
  - Fixed `/book-call` and `/request-project` routes which were making forbidden direct client-side fetch calls to `api.resend.com` (causing CORS blocks in real browser testing).
  - All form submissions now route cleanly through backend endpoints (`/api/contact/book-call`, `/api/contact/submit`, `/api/careers/apply`, `/api/projects/submit`).
- **Verified End-to-End Real User Flow**:
  - Verified Quick Discovery Call, Define Project Scope, Project Inquiry Brief, and Careers Application end-to-end.
  - Confirmed real database records in Supabase tables `meetings`, `projects`, `career_applications`.
- **Projects Section & Record Writers Detail Route Fix**:
  - Refactored `src/routes/work.tsx` layout parent to render `<Outlet />`, resolving routing loop so "Know About Project" navigates directly to `/work/record-writers`.
  - Added loader SSR data hydration in `src/routes/work.$projectId.tsx` so direct page refreshes and initial route visits load the Record Writers case study cleanly (HTTP 200 OK).
  - Confirmed "← Back to Work Showcase" button returns directly to `/work`.
  - Displayed authentic project details: title, problem statement, what was built, key features, metrics (`< 2 Hours`, `AES-256`, `99.99%`), complete tech stack, and 4 relevant service categories (`Software & SaaS`, `AI Custom Solutions`, `Website & App Development`, `Business & Operations`).
  - Preserved live URL "Visit Website" opening `https://recordwriters07.netlify.app/` in a new tab.
- **Cookie System Audit & Clean-up**:
  - Audited codebase and confirmed ZERO non-essential tracking cookies or third-party marketing pixels exist.
  - Removed unnecessary cookie consent modal / preference popup UI (`CookiePreferencesModal.tsx` and "Cookie Settings" footer triggers).
  - Updated `/cookie-policy` page to accurately state technical storage only (session auth and Cloudflare Turnstile anti-bot security challenges).
- **Privacy Policy, Cookie Policy, Terms of Service & Preference Management**:
  - Implemented Privacy Policy page (`/privacy-policy`) outlining transparent data processing practices.
  - Implemented Cookie Policy page (`/cookie-policy`) clarifying usage of session cookies, Cloudflare Turnstile anti-bot checks, and local storage.
  - Implemented Terms of Service page (`/terms`) defining service terms, scope expectations, and liability limits.
  - Implemented `CookiePreferencesModal.tsx` allowing visitors to manage local storage preferences (`krait_cookie_consent_v1`).
  - Added footer legal links and interactive `Cookie Settings` modal trigger.
  - Added concise form consent notices linking to Privacy Policy and Terms of Service under submit buttons across `/contact`, `/book-call`, `/request-project`, and `/careers`.
- **Critical Data Integrity Fix — No Invented Data / Strict Form Matching**:
  - **Eliminated Surname & Placeholder Generation**: Removed fallbacks (such as `"Guest Client"` or `"kraitabyss07@gmail.com"`) that were substituting or appending un-submitted names/surnames. If a client submits `"Alia"`, the system, database, and email output strictly `"Alia"`.
  - **Client Email vs Admin Email Separation**: Guaranteed that the client's submitted email address (`clientEmail`) is never overwritten by the admin recipient email (`kraitabyss07@gmail.com`). Set `reply_to: clientEmail` in Resend API notifications so admin replies route directly to the client.
  - **Eliminated Cross-Form Data Leakage in Quick Discovery Call**: Quick Discovery Call (`/contact`) now submits ONLY what its UI contains (Day, Time, Phone). Removed cross-form state leaks from the adjacent Project Scope form.
  - **Database & Email Template Synchronization**: Enforced `USER INPUT = DATABASE VALUE = EMAIL VALUE` across all forms (`/contact`, `/book-call`, `/request-project`, `/careers`). Missing optional fields render as `"Not provided"` or `null` — never replaced with admin data or invented values.

---

## 2026-09-29

### Fixed
- **Quick Discovery Call Email Dispatch**: Fixed missing email notifications by routing requests through server endpoint `/api/contact/book-call` using backend Resend API.
- **Phone Number Digit Restrictions**: Enforced country-specific digit counts (e.g. 10 digits for India `+91`) across scheduler and contact forms.
- **Project Scope Inquiry Form**: Resolved slow submissions and missing email fields. Form submissions now POST to `/api/contact/submit` and include client details, deliverables breakdown, demo requests, target budgets (18+ global currencies), reference links, and brief text.
- **Project Case Studies Routing ("Know About Project")**: Fixed static hardcoded text in `/work/$projectId`. Project detail page now dynamically displays problem statements, what was built, key features, frontend/backend/database tech stack, automation features, deployment platform, and live URL for whatever project was clicked.
- **Careers Application Form & Resume Upload**:
  - Reused shared `COUNTRY_OPTIONS` international phone architecture from `/contact` for global applicant support (22+ countries).
  - Removed all specific example phone placeholders (`+91 98765 43210`) in favor of neutral placeholders (`Enter phone number`).
  - Implemented strict client and server validation for Full Name (letters only), Email, Country-Aware Phone (min/max digits), Location, Role, LinkedIn Profile URL, Portfolio URL, Experience Level, Skills (min 5 chars), and Motivation (min 15 chars).
  - Implemented PDF, DOC, and DOCX resume upload with 5 MB file size limit.
  - Added base64 file processing on backend endpoint `/api/careers/apply` saving files to `uploads/resumes/`.
  - Configured Resend email dispatch to `kraitabyss07@gmail.com` with resume file attachment using dedicated key `process.env.RESEND_CAREERS_KEY`.
- **Express Payload Limit**: Increased Express JSON body parsing limit to `15mb` in `server/twoFactorServer.ts` to allow 5 MB base64 PDF uploads without server truncation.
- **Duplicate Submission Protection**: Enabled immediate button disabling and loading indicators during submission across all forms.

### Added
- Created `PROJECT_STATE.md` master reference documenting architecture, endpoints, forms, email flows, and deployment status.
- Created `CHANGELOG.md` for persistent change tracking.
- Created `DEPLOYMENT_CHECKLIST.md` for production verification steps.
- Created `.env.example` documenting all required environment variable names without exposing secrets.

---

## 2026-09-28

### Fixed
- Fixed 2FA TOTP setup and verification endpoints in `server/twoFactorServer.ts`.
- Configured AES-256-GCM encryption helpers for 2FA secret protection.
- Updated Krait Assistant chatbot with direct Email & WhatsApp text-only contact options.
