# Krait Abyss — System Architecture

## Overview

Krait Abyss is a full-stack, enterprise-grade web application built using **TanStack Start**, **Vite**, **Nitro**, **React 19**, **Express**, and **Supabase**.

```text
                                  +-----------------------+
                                  |     User Browser      |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  |   Vite / TanStack     |
                                  |   Start SSR Router    |
                                  +-----------+-----------+
                                              |
                       +----------------------+----------------------+
                       |                                             |
                       v                                             v
          +------------+------------+                   +------------+------------+
          | Express 2FA Server      |                   | Supabase Backend /      |
          | (server/twoFactorServer)|                   | Postgres DB & Auth      |
          +-------------------------+                   +-------------------------+
```

---

## Technical Stack

| Layer                  | Technology                           | Description                                              |
| :--------------------- | :----------------------------------- | :------------------------------------------------------- |
| **Frontend Framework** | React 19, TanStack Start             | Modern SSR & client hydration framework                  |
| **Routing**            | TanStack Router                      | File-based type-safe routing (`src/routes`)              |
| **Styling**            | Tailwind CSS v4, Lucide Icons        | Dark technical design system                             |
| **API Server**         | Express                              | Embedded middleware server (`server/twoFactorServer.ts`) |
| **Authentication**     | Supabase Auth + Local Auth           | Hybrid auth with 2FA TOTP protection                     |
| **Database**           | PostgreSQL (Supabase)                | Versioned migrations (`supabase/migrations`)             |
| **2FA / Cryptography** | `speakeasy`, `qrcode.react`, AES-GCM | Standards-compliant TOTP and backup codes                |
| **Test Suite**         | Node.js `tsx` Test Runner            | 12-scenario production security test suite               |

---

## Directory Organization

```text
krait-abyss-website/
├── docs/                     # Technical documentation & architecture guides
│   ├── ARCHITECTURE.md
│   ├── 2FA_SECURITY.md
│   └── DEVELOPER_GUIDE.md
├── server/                   # Express backend middleware & API servers
│   ├── twoFactorServer.ts     # TOTP 2FA generation, verification & backup codes
│   └── config/ai.ts          # Server AI LLM configuration
├── src/                      # Frontend application codebase
│   ├── components/           # Reusable UI components
│   │   └── site/             # Application modals, forms & widgets
│   ├── config/               # Chatbot & app configuration
│   ├── data/                 # Data constants (services, team, site, FAQ)
│   ├── hooks/                # Custom React hooks (useDeviceViewport)
│   ├── integrations/         # Supabase client & type definitions
│   ├── lib/                  # Error handling & utility functions
│   ├── routes/               # TanStack Router file-based pages
│   ├── services/             # Frontend business logic & API services
│   └── styles.css            # Core CSS theme & tokens
├── supabase/                 # Database schema & migrations
│   └── migrations/           # Versioned SQL schema changes
├── tests/                    # Automated security & integration test suite
│   └── security.test.ts
├── .env.example              # Safe environment variable template
├── package.json
└── vite.config.ts            # Vite & Nitro build configuration
```
