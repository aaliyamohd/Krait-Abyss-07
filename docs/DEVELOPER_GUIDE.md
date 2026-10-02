# Krait Abyss — Developer & Setup Guide

## Quick Start

### 1. Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 22 recommended)
- **npm**: `v9.0.0` or higher

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

---

## Environment Keys Matrix (15 Keys)

All 15 keys are configured in `.env` and `.env.example`:

| Environment Key                 | Purpose / Description                                   | Status in `.env`                 | Consuming Modules                                                         |
| :------------------------------ | :------------------------------------------------------ | :------------------------------- | :------------------------------------------------------------------------ |
| `VITE_SUPABASE_URL`             | Supabase Public Project Endpoint                        | Configured                       | `src/integrations/supabase/client.ts`, `server/twoFactorServer.ts`        |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Public Anon Key                                | Configured                       | `src/integrations/supabase/client.ts`, `server/twoFactorServer.ts`        |
| `SUPABASE_URL`                  | Supabase Private Server Endpoint                        | Configured                       | `src/integrations/supabase/client.server.ts`, `server/twoFactorServer.ts` |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase Private Admin Role Secret Key                  | Configured                       | `src/integrations/supabase/client.server.ts`, `server/twoFactorServer.ts` |
| `TWO_FACTOR_ENCRYPTION_KEY`     | 64-character Hex Encryption Key for 2FA                 | Configured                       | `encryption.js`, `server/twoFactorServer.ts`                              |
| `ADMIN_EMAIL`                   | Admin notification recipient (`kraitabyss07@gmail.com`) | Configured                       | `server/twoFactorServer.ts`                                               |
| `WHATSAPP_ADMIN_NUMBER`         | Admin WhatsApp recipient (`+917386613995`)              | Configured                       | `server/twoFactorServer.ts`, `src/data/site.ts`                           |
| `RESEND_API_KEY`                | Resend Email API Key                                    | In `.env` (template placeholder) | `server/twoFactorServer.ts`                                               |
| `EMAIL_WEBHOOK_URL`             | Optional Email Webhook URL                              | In `.env` (optional fallback)    | `server/twoFactorServer.ts`                                               |
| `TELEGRAM_BOT_TOKEN`            | Telegram Bot Token (`bot123456:ABC...`)                 | In `.env` (template placeholder) | `server/twoFactorServer.ts`                                               |
| `TELEGRAM_CHAT_ID`              | Telegram Admin Chat ID (`12345678`)                     | In `.env` (template placeholder) | `server/twoFactorServer.ts`                                               |
| `TWILIO_ACCOUNT_SID`            | Twilio Account SID for WhatsApp                         | In `.env` (template placeholder) | `server/twoFactorServer.ts`                                               |
| `TWILIO_AUTH_TOKEN`             | Twilio Auth Token for WhatsApp                          | In `.env` (template placeholder) | `server/twoFactorServer.ts`                                               |
| `TWILIO_WHATSAPP_NUMBER`        | Twilio WhatsApp Sender (`whatsapp:+14155238886`)        | Configured                       | `server/twoFactorServer.ts`                                               |
| `WHATSAPP_WEBHOOK_URL`          | Optional WhatsApp Webhook URL                           | In `.env` (optional fallback)    | `server/twoFactorServer.ts`                                               |

---

## Multi-Channel Dispatch Architecture

The platform provides a centralized notification dispatch engine inside `server/twoFactorServer.ts`:

1. **Email Channel**: Primary delivery via Resend API (`RESEND_API_KEY` to `ADMIN_EMAIL`). Falls back seamlessly to `EMAIL_WEBHOOK_URL` if Resend is pending or encounters domain verification restrictions.
2. **WhatsApp Channel**: Primary delivery via Twilio API (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER` to `WHATSAPP_ADMIN_NUMBER`). Falls back to `WHATSAPP_WEBHOOK_URL` if Twilio is pending or errors.
3. **Telegram Channel**: Direct bot dispatch (`TELEGRAM_BOT_TOKEN` to `TELEGRAM_CHAT_ID`). Safely detects template placeholders and logs pending status.
4. **All Intake Points Wired**:
   - Contact Form Inquiries (`POST /api/contact/submit`)
   - 15-Minute Discovery Calls (`POST /api/contact/book-call`)
   - Client Project Requests (`POST /api/projects/submit`)

---

## Diagnostic Endpoints

### `GET /api/env/status`

Returns the operational status of all 15 environment variables with private secrets securely masked.

Example Response:

```json
{
  "totalKeys": 15,
  "configuredCount": 8,
  "keys": {
    "VITE_SUPABASE_URL": {
      "status": "CONFIGURED",
      "preview": "http...n.co",
      "type": "client_public"
    },
    "TWO_FACTOR_ENCRYPTION_KEY": {
      "status": "CONFIGURED",
      "preview": "57e9...7a9",
      "type": "server_private_crypto"
    },
    "RESEND_API_KEY": {
      "status": "TEMPLATE_PLACEHOLDER",
      "preview": "your...here",
      "type": "email_dispatcher"
    }
  },
  "systemTime": "2026-09-23T22:00:00.000Z"
}
```

---

## Commands & Scripts

| Command                             | Action                                                          |
| :---------------------------------- | :-------------------------------------------------------------- |
| `npm run dev`                       | Starts Vite development server & 2FA Express backend middleware |
| `npm run build`                     | Builds production client bundle & Nitro server workers          |
| `npx tsc --noEmit`                  | Runs full TypeScript static type checking                       |
| `npx tsx tests/environment.test.ts` | Runs the 15-key environment & dispatcher test suite             |
| `npx tsx tests/security.test.ts`    | Runs the 12-scenario security audit test suite                  |
| `npm run lint`                      | Runs ESLint analysis                                            |
| `npm run format`                    | Runs Prettier code formatting                                   |

---

## Database Migrations

Migrations are stored in `supabase/migrations/`:

- `20260921000000_create_user_2fa.sql`: Creates `user_2fa` table with AES-encrypted secrets and RLS policies.
- `20260915000000_production_security_hardening.sql`: Security hardening policies and indexes.

Apply migrations via Supabase CLI:

```bash
supabase db push
```
