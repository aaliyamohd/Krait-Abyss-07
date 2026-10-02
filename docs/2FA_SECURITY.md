# Krait Abyss — 2FA Security Architecture

## Overview

Krait Abyss implements **Time-based One-Time Password (TOTP) Two-Factor Authentication** compliant with RFC 6238 and RFC 4226.

---

## 2FA Operation Flow

### 1. Enrollment (`POST /api/2fa/generate`)

- The server generates a Base32 secret key using `speakeasy.generateSecret()`.
- Generates a standard `otpauth://` URI:
  `otpauth://totp/Krait%20Abyss:user@domain.com?secret=BASE32KEY&issuer=Krait%20Abyss`
- Renders a QR code using `qrcode.react` for scanning into Google Authenticator, Authy, or 1Password.

### 2. Confirmation & Backup Codes (`POST /api/2fa/verify-setup`)

- User inputs their initial 6-digit authenticator code.
- Server validates code with timing-safe string comparison and clock drift tolerance ($\pm 1$ step / 30s).
- Generates 10 single-use emergency backup codes (`XXXX-XXXX`).
- Saves SHA-256 hashes of backup codes in the database (`user_2fa.backup_code_hashes`).
- Sets `two_factor_enabled = true` on the user profile.

### 3. Login Verification (`POST /api/2fa/verify`)

- Prompted automatically during login if `user.twoFactorEnabled === true`.
- Accepts either:
  - 6-digit TOTP token from authenticator app.
  - 8-character single-use emergency backup code.

---

## Security Mitigations

1. **Rate Limiting**:
   - In-memory rate limiting enforces a maximum of 5 verification attempts per 5 minutes per user (`checkRateLimit`).
2. **Replay Protection**:
   - Used `(user_id, time_step)` pairs are tracked in memory to prevent replay attacks during the 30-second TOTP window.
3. **Timing-Safe Comparison**:
   - All token comparisons use `crypto.timingSafeEqual` to prevent timing side-channel attacks.
4. **Secret Storage Encryption**:
   - TOTP secrets are encrypted at rest using AES-256-GCM derived from `TWO_FACTOR_ENCRYPTION_KEY`.
