# Krait Abyss — Technical Agency Platform & AI Guide

**Krait Abyss** is a high-performance web platform and AI automation agency system providing software engineering, AI pipeline automation, and digital transformation solutions.

---

## Key Features

- **Type-Safe File-Based Routing**: Driven by TanStack Start and TanStack Router.
- **Client & Admin Access Portal**: Comprehensive user dashboard for managing project requests, booking discovery calls, and managing account profiles.
- **TOTP Two-Factor Authentication (2FA)**: RFC 6238 compliant 2FA with live QR Code scanning (Google Authenticator, Authy, 1Password) and 10 single-use emergency backup codes.
- **Krait Assistant AI Chatbot**: Multi-mode AI assistant operating in zero-dependency FAQ mode or optional server-side LLM enhancement (`/api/chat`).
- **Direct WhatsApp & Phone Dispatch**: Instant brief dispatch and communication via direct phone integration (`+91 7386613995`).
- **Automated Security Verification**: Production security test suite validating IDOR protection, role escalations, and encryption fail-closed constraints.

---

## Technology Stack

- **Frontend**: React 19, TanStack Start, TanStack Router, Tailwind CSS v4, Lucide React
- **Backend Server**: Embedded Express Middleware (`server/twoFactorServer.ts`), Nitro Cloudflare Preset
- **Database & Auth**: Supabase PostgreSQL & Auth with standalone fallback capability
- **Security & Cryptography**: `speakeasy`, `qrcode.react`, AES-256-GCM encryption
- **TypeScript**: Strict type system (`npx tsc --noEmit` verified 0 errors)

---

## High-Level Architecture

```text
krait-abyss-website/
├── docs/                     # Project architecture & security guides
│   ├── ARCHITECTURE.md       # High-level architecture documentation
│   ├── 2FA_SECURITY.md       # TOTP 2FA technical specifications
│   └── DEVELOPER_GUIDE.md    # Development setup & migration guide
├── server/                   # Express backend middleware
│   ├── twoFactorServer.ts     # TOTP 2FA API endpoints & backup codes
│   └── config/ai.ts          # Server AI provider configuration
├── src/                      # Application source code
│   ├── components/           # Reusable UI components & 2FA widgets
│   │   └── site/             # Auth modals, TwoFactorSetup, Header, Footer
│   ├── config/               # Chatbot & app parameters
│   ├── data/                 # Site metadata, services, team & FAQ data
│   ├── hooks/                # Custom React hooks (useDeviceViewport)
│   ├── integrations/         # Supabase client and generated DB types
│   ├── lib/                  # Error capturing & utility functions
│   ├── routes/               # TanStack Router page components
│   ├── services/             # API services (authService, projectService, meetingService)
│   └── styles.css            # Tailwind CSS styling and theme tokens
├── supabase/                 # Versioned database migrations
│   └── migrations/           # PostgreSQL migration scripts
├── tests/                    # Security audit test suite
│   └── security.test.ts
├── .env.example              # Safe environment variable template
├── package.json              # Dependencies and run scripts
└── vite.config.ts            # Vite & Nitro build setup
```

---

## Setup & Local Development

### 1. Prerequisites

- **Node.js**: `v18.0.0+`
- **npm**: `v9.0.0+`

### 2. Installation

```bash
# Clone repository
git clone <repository-url>
cd krait-abyss-website

# Install dependencies
npm install
```

### 3. Environment Variable Configuration

Copy the template `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your credentials in `.env`:

```ini
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_anon_key
SUPABASE_URL=https://your-supabase-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TWO_FACTOR_ENCRYPTION_KEY=64_character_hex_encryption_key
```

### 4. Running the Development Server

```bash
npm run dev
```

The application will launch at **`http://localhost:8080`**.

---

## Verification & Testing

Run the project verification commands:

```bash
# 1. Run 12-Scenario Security Test Suite
npx tsx tests/security.test.ts

# 2. Run TypeScript Static Type Checking (0 errors)
npx tsc --noEmit

# 3. Run ESLint Analysis
npm run lint

# 4. Code Formatting
npm run format

# 5. Production Build
npm run build
```

---

## Security Notes

1. **Service Role & Private Secrets**: Never prefix private secrets (`SUPABASE_SERVICE_ROLE_KEY`, `LLM_API_KEY`) with `VITE_`.
2. **2FA Protection**: 2FA secret generation and verification run server-side. Secrets are encrypted at rest using AES-256-GCM.
3. **Role Protection**: Client-side profile updates cannot mutate user roles. Role changes are strictly bound to server verification.
