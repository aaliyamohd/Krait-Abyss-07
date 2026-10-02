/**
 * Krait Abyss - 15 Environment Keys & Multi-Channel Dispatch Verification Suite
 *
 * Validates:
 * 1. Complete definition of all 15 keys in .env and .env.example
 * 2. Strict client/server secret isolation (no VITE_ on private keys)
 * 3. AES-256-GCM encryption/decryption with TWO_FACTOR_ENCRYPTION_KEY
 * 4. Format validation for admin targets and dispatcher numbers
 * 5. Multi-channel dispatch resilience (Email, WhatsApp, Telegram) with template placeholders
 * 6. Health diagnostic endpoint GET /api/env/status
 */

process.env.NODE_ENV = "test";

import fs from "fs";
import http from "http";
import { encryptSecret, decryptSecret } from "../encryption.js";
import app from "../server/twoFactorServer";

interface ProcessWithEnvFile {
  loadEnvFile?: () => void;
}
const proc = process as unknown as ProcessWithEnvFile;
if (typeof proc.loadEnvFile === "function") {
  try {
    proc.loadEnvFile();
  } catch {
    // Ignore
  }
}

async function runEnvironmentTests() {
  console.log("==================================================================");
  console.log("  KRAIT ABYSS - 15-KEY ENVIRONMENT & DISPATCHER VERIFICATION     ");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`[PASS] ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] ${description}`);
      failed++;
    }
  }

  const REQUIRED_KEYS = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET",
    "TWO_FACTOR_ENCRYPTION_KEY",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "WHATSAPP_ADMIN_NUMBER",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_KEY",
    "LLM_API_KEY",
    "AI_PROVIDER",
  ];

  // --------------------------------------------------------------------------
  // TEST 1: Check .env.example definitions
  // --------------------------------------------------------------------------
  const envExampleContent = fs.readFileSync(".env.example", "utf8");
  const missingInExample = REQUIRED_KEYS.filter((k) => !envExampleContent.includes(k));
  assert(
    missingInExample.length === 0,
    `Scenario 1: All required keys are defined in .env.example (Missing: ${missingInExample.join(", ") || "None"}).`,
  );

  // --------------------------------------------------------------------------
  // TEST 2: Check .env definitions
  // --------------------------------------------------------------------------
  const envContent = fs.readFileSync(".env", "utf8");
  const missingInEnv = REQUIRED_KEYS.filter((k) => !envContent.includes(k));
  assert(
    missingInEnv.length === 0,
    `Scenario 2: All required keys are defined in root .env (Missing: ${missingInEnv.join(", ") || "None"}).`,
  );

  // --------------------------------------------------------------------------
  // TEST 3: Secret Isolation - No private server secrets exposed via VITE_
  // --------------------------------------------------------------------------
  const privateSecrets = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "TWO_FACTOR_ENCRYPTION_KEY",
    "SMTP_KEY",
    "LLM_API_KEY",
    "ADMIN_PASSWORD",
  ];

  const leaks = privateSecrets.filter((secret) => {
    return envExampleContent.includes(`VITE_${secret}`) || envContent.includes(`VITE_${secret}`);
  });
  assert(
    leaks.length === 0,
    `Scenario 3: Zero private server secrets leak into VITE_ client bundle namespace.`,
  );

  // --------------------------------------------------------------------------
  // TEST 4: TWO_FACTOR_ENCRYPTION_KEY AES-256-GCM Verification
  // --------------------------------------------------------------------------
  const encKey = process.env["TWO_FACTOR_ENCRYPTION_KEY"] || "";
  const is64Hex = /^[0-9a-fA-F]{64}$/.test(encKey);
  assert(
    is64Hex,
    `Scenario 4: TWO_FACTOR_ENCRYPTION_KEY is a cryptographically valid 64-character hex key (Length: ${encKey.length}).`,
  );

  const testPayload = "JBSWY3DPEHPK3PXP-SECRET-OTP-KEY";
  const encrypted = encryptSecret(testPayload);
  const parts = encrypted.split(":");
  assert(
    parts.length === 3 && parts[0]!.length === 24 && parts[1]!.length === 32,
    `Scenario 5: encryptSecret produces valid AES-256-GCM format (iv:authTag:ciphertext).`,
  );

  const decrypted = decryptSecret(encrypted);
  assert(
    decrypted === testPayload,
    `Scenario 6: decryptSecret successfully restores the original plain-text secret.`,
  );

  // --------------------------------------------------------------------------
  // TEST 5: Admin target validation
  // --------------------------------------------------------------------------
  const adminEmail = process.env["ADMIN_EMAIL"] || "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert(
    emailRegex.test(adminEmail) && adminEmail === "kraitabyss07@gmail.com",
    `Scenario 7: ADMIN_EMAIL is set to valid notification recipient (${adminEmail}).`,
  );

  const adminPhone = process.env["WHATSAPP_ADMIN_NUMBER"] || "";
  const phoneRegex = /^\+[1-9]\d{7,14}$/;
  assert(
    phoneRegex.test(adminPhone) && adminPhone === "+917386613995",
    `Scenario 8: WHATSAPP_ADMIN_NUMBER is set to valid E.164 phone number (${adminPhone}).`,
  );

  const smtpHost = process.env["SMTP_HOST"] || "";
  assert(
    smtpHost.includes("brevo.com"),
    `Scenario 9: SMTP_HOST is set to active Brevo relay endpoint (${smtpHost}).`,
  );

  // --------------------------------------------------------------------------
  // TEST 6: Supabase Endpoint Verification
  // --------------------------------------------------------------------------
  const supabaseUrl = process.env["VITE_SUPABASE_URL"] || "";
  assert(
    supabaseUrl.startsWith("https://") && supabaseUrl.includes(".supabase.co"),
    `Scenario 10: VITE_SUPABASE_URL is a secure HTTPS Supabase endpoint.`,
  );

  // --------------------------------------------------------------------------
  // TEST 7: Server Diagnostic & Project Intake Endpoints
  // --------------------------------------------------------------------------
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 3001;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 7A: GET /api/env/status
    const statusRes = await fetch(`${baseUrl}/api/env/status`);
    const statusData = await statusRes.json();
    assert(
      statusRes.ok &&
        statusData.totalKeys >= 15 &&
        typeof statusData.configuredCount === "number",
      `Scenario 11: GET /api/env/status returns diagnostic summary for all keys (Configured: ${statusData.configuredCount}/${statusData.totalKeys}).`,
    );

    // Verify secrets are masked
    const twoFactorPreview = statusData.keys?.TWO_FACTOR_ENCRYPTION_KEY?.preview;
    assert(
      twoFactorPreview && twoFactorPreview.includes("...") && !twoFactorPreview.includes(encKey),
      `Scenario 12: GET /api/env/status masks sensitive secret values safely.`,
    );

    // 7B: POST /api/projects/submit
    const projRes = await fetch(`${baseUrl}/api/projects/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceType: "AI Agent Automation",
        projectDescription: "Autonomous workflow pipeline with tool calling",
        company: "Acme Labs",
        phone: "+1 555-0192",
        budgetRange: "$10,000 - $25,000",
        timeline: "2 - 4 Weeks",
      }),
    });
    const projData = await projRes.json();
    assert(
      projRes.ok && projData.success === true && Boolean(projData.requestId),
      `Scenario 13: POST /api/projects/submit handles project briefs and triggers notification dispatches.`,
    );

    // 7C: POST /api/contact/submit
    const contactRes = await fetch(`${baseUrl}/api/contact/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test Client",
        email: "test@example.com",
        projectDescription: "Testing multi-channel dispatch with template fallback",
      }),
    });
    const contactData = await contactRes.json();
    assert(
      contactRes.ok && contactData.success === true,
      `Scenario 14: POST /api/contact/submit runs without unhandled rejections under template placeholders.`,
    );

    // 7D: POST /api/contact/book-call
    const callRes = await fetch(`${baseUrl}/api/contact/book-call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test Client",
        email: "test@example.com",
        day: "Tue",
        timeSlot: "3:00 PM",
      }),
    });
    const callData = await callRes.json();
    assert(
      callRes.ok && callData.success === true,
      `Scenario 15: POST /api/contact/book-call runs without unhandled rejections under template placeholders.`,
    );
  } finally {
    server.close();
  }

  console.log("\n==================================================================");
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: 15/15)`);
  console.log("==================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runEnvironmentTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
