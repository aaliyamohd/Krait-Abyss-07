# DEPLOYMENT CHECKLIST — KRAIT ABYSS ENTERPRISE PLATFORM

Use this checklist to verify production readiness before every deployment.

---

## 1. Frontend Audit
- [x] Production build compiles cleanly (`npm run build`).
- [x] TypeScript type checking passes (`npx tsc --noEmit` code 0).
- [x] No missing imports or broken route definitions in `routeTree.gen.ts`.
- [x] No hardcoded development-only localhost URLs in production client bundles.
- [x] UI visual design preserved (dark/black aesthetic, responsive layouts).

## 2. Backend Audit
- [x] Express backend server starts without errors (`server/twoFactorServer.ts`).
- [x] CORS configured for production domain (`https://kraitabyss.com`) and local development ports.
- [x] JSON body parser set to `15mb` to allow 5 MB base64 resume file uploads.
- [x] Rate limiting active (`checkRateLimit`) on all public intake endpoints.
- [x] OWASP ASVS security headers configured (HSTS, CSP, X-Frame-Options).

## 3. Email System Audit
- [x] Quick Discovery Call notification dispatches to `kraitabyss07@gmail.com`.
- [x] Project Scope Inquiry notification dispatches via dedicated Resend key (`re_YenVBwCK_...`) to `kraitabyss07@gmail.com`.
- [x] Careers job application notification dispatches via dedicated Resend key (`re_Q8u4Gxbr_...`) to `kraitabyss07@gmail.com` with resume attachment.
- [x] No secret API keys exposed in client-side React code.

## 4. Careers & File Security Audit
- [x] Client & server validation active for Name, Email, Phone, Location, Role, LinkedIn, Portfolio, Experience, Skills, and Why.
- [x] Resume file extension restricted to `.pdf`, `.doc`, `.docx`.
- [x] File size capped at 5 MB max. Rejects executables, scripts, and archives.
- [x] Resumes saved securely to `uploads/resumes/` on backend.
- [x] `uploads/` directory ignored in `.gitignore`.
- [x] Form Reset after successful submission clears all controlled input state, textareas, selects, validation error state, turnstile tokens, and file references when clicking "Submit Another Application".
- [x] Secure Admin Panel Resume Access & Download active via `GET /api/admin/careers/resume/:fileName` with admin authorization check and path traversal protection.



## 5. Projects Section Audit
- [x] "Visit Website" opens project live URL (`https://recordwriters07.netlify.app/`) in a new tab.
- [x] "Know About Project" navigates cleanly to dedicated Record Writers project detail route (`/work/record-writers`).
- [x] Dedicated detail page renders problem statement, built system details, key features, metrics, tech stack breakdown, and 4 relevant service categories.
- [x] "← Back to Work Showcase" button returns directly to `/work`.
- [x] Direct URL refreshes to `/work/record-writers` load cleanly (HTTP 200 OK) without 404s.

## 6. Security & Legal Audit
- [x] Privacy Policy (`/privacy-policy`), Cookie Policy (`/cookie-policy`), and Terms of Service (`/terms`) routes active.
- [x] Audited codebase: Zero non-essential advertising trackers, Meta Pixels, or GA scripts present. Unnecessary consent banner/modal removed.
- [x] Cookie Policy updated to accurately state technical session storage and Cloudflare Turnstile anti-bot security challenges only.
- [x] Form consent notices present under submit buttons across `/contact`, `/book-call`, `/request-project`, and `/careers`.
- [x] No real passwords, secret tokens, or private keys committed to Git.
- [x] `.env.example` provided for environment setup reference.
- [x] Input sanitization (`sanitizeString`) active on string inputs.

## 7. Performance & Database Audit
## 8. Netlify Deployment & Technical SEO Audit
- [x] Netlify Functions created (`netlify/functions/book-call.ts`, `netlify/functions/submit-brief.ts`, `netlify/functions/apply-career.ts`).
- [x] `netlify.toml` configured with `functions = "netlify/functions"` and SPA fallback redirects (`/* /index.html 200`).
- [x] `public/_redirects` created for native Netlify static edge routing.
- [x] Robots.txt disallows `/admin`, `/dashboard`, `/login`, `/api/` while allowing Googlebot and Bingbot on public routes.
- [x] Sitemap (`public/sitemap.xml`) updated with production HTTPS canonical URLs for all public pages including `/work/record-writers`.
- [x] `{ name: "robots", content: "noindex, nofollow" }` meta tags added to `/admin`, `/dashboard`, `/login`.
- [x] Schema.org JSON-LD (`Organization`, `WebSite`) script integrated in `__root.tsx`.
- [x] Production ZIP archive created (`krait-abyss-website-complete.zip` - 6.30 MB) and verified via clean extraction self-test.

### Required Netlify Environment Variables (Variable Names Only):
- `RESEND_API_KEY` (Secret API Key for email sending via Resend)
- `ADMIN_EMAIL` (Target admin notification email, default: `kraitabyss07@gmail.com`)
- `SUPABASE_URL` or `VITE_SUPABASE_URL` (Supabase Project URL)
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` or `VITE_SUPABASE_ANON_KEY` (Supabase Key)
- `TURNSTILE_SECRET_KEY` (Optional Cloudflare Turnstile Secret Key)

- [x] Submit buttons disable immediately upon click to prevent duplicate submissions.
- [x] Loading state clears reliably on completion, validation error, or server error.

## 8. Production Data Cleanup Audit
- [x] All development test records purged from Supabase PostgreSQL database tables (`meetings`, `projects`, `career_applications`, `contact_requests`).
- [x] All test resume files cleared from `uploads/resumes/` while maintaining folder structure.
- [x] Zero automatic demo/test record seeding on application startup or database initialization.
- [x] Database schemas, RLS policies, storage buckets, API endpoints, and admin accounts (`kraitabyss07@gmail.com`) 100% preserved.
- [x] Admin Panel verified in clean empty-state mode ("No applications yet", "No project briefs submitted yet", "No discovery calls requested yet").
