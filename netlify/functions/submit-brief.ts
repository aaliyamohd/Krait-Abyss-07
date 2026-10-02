import type { Handler } from "@netlify/functions";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND_DISCOVERY_KEY || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NOTIFY_EMAIL || "kraitabyss07@gmail.com";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const requestId = `KA-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Supabase Database Logging (Server-side)
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            name: `${payload.serviceType || "Project Request"} - ${payload.fullName}`,
            description: payload.projectDescription,
            service_type: payload.serviceType || "Software & SaaS",
            budget_range: payload.targetBudget || null,
            timeline: payload.timeline || null,
            status: "INTAKE_RECEIVED",
            company: payload.company || null,
            user_email: payload.email,
            user_name: payload.fullName,
          }),
        });
      } catch (dbErr) {
        console.warn("[NETLIFY FUNCTION DB LOG ERROR]:", dbErr);
      }
    }

    // 2. Resend Email Dispatch
    const emailSubject = `[NEW PROJECT BRIEF] ${payload.fullName} — ${payload.serviceType || "Project Specification"}`;
    const emailBody =
      `===================================================\n` +
      `          NEW PROJECT BRIEF RECEIVED              \n` +
      `===================================================\n\n` +
      `Request ID:          ${requestId}\n` +
      `Client Name:         ${payload.fullName}\n` +
      `Email Address:       ${payload.email}\n` +
      `Phone Number:        ${payload.phone || "Not specified"}\n` +
      `Company / Org:       ${payload.company || "Not specified"}\n` +
      `Service Category:    ${payload.serviceType || "Not specified"}\n` +
      `Selected System Tier:${payload.selectedTier || "Not specified"}\n` +
      `Target Budget:       ${payload.targetBudget || "Not specified"}\n` +
      `Target Timeline:     ${payload.timeline || "Not specified"}\n` +
      `Custom Demo Requested:${payload.requestCustomDemo ? "YES" : "NO"}\n` +
      `Product URL:         ${payload.productUrl || "Not specified"}\n` +
      `Relevant Links:      ${payload.relevantLinks || "Not specified"}\n\n` +
      `PROJECT DESCRIPTION & REQUIREMENTS\n` +
      `---------------------------------------------------\n` +
      `${payload.projectDescription}\n`;

    let emailSent = false;
    if (RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Krait Abyss Portal <onboarding@resend.dev>",
            to: [ADMIN_EMAIL],
            reply_to: payload.email,
            subject: emailSubject,
            text: emailBody,
          }),
        });
        emailSent = resendRes.ok;
      } catch (resendErr) {
        console.warn("[NETLIFY FUNCTION RESEND ERROR]:", resendErr);
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        requestId,
        emailSent,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err?.message || "Internal server error" }),
    };
  }
};
