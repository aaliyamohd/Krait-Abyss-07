import type { Handler } from "@netlify/functions";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND_CAREERS_KEY || "";
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
    const applicationId = `app-${Date.now()}`;

    // 1. Supabase Database Logging (Server-side)
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/career_applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            full_name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            location: payload.location,
            role_applied: payload.roleApplied,
            portfolio_url: payload.portfolioUrl || null,
            cover_note: `Experience: ${payload.experience}\nLinkedIn: ${payload.linkedin}\nSkills: ${payload.skills}\nWhy: ${payload.whyKraitAbyss}`,
            resume_url: payload.resume?.fileName || "uploaded_resume",
          }),
        });
      } catch (dbErr) {
        console.warn("[NETLIFY FUNCTION DB LOG ERROR]:", dbErr);
      }
    }

    // Prepare attachments if present
    let attachments: any[] = [];
    if (payload.resume && payload.resume.base64Data && payload.resume.fileName) {
      const cleanBase64 = payload.resume.base64Data.replace(/^data:[^;]+;base64,/, "");
      attachments.push({
        filename: payload.resume.fileName.replace(/[^\w.-]/g, "_"),
        content: cleanBase64,
      });
    }

    // 2. Resend Email Dispatch
    const emailSubject = `[NEW JOB APPLICATION] ${payload.fullName} — ${payload.roleApplied}`;
    const emailBody =
      `===================================================\n` +
      `          NEW JOB APPLICATION RECEIVED            \n` +
      `===================================================\n\n` +
      `Application ID:   ${applicationId}\n` +
      `Applicant Name:   ${payload.fullName}\n` +
      `Email Address:    ${payload.email}\n` +
      `Phone Number:     ${payload.phone}\n` +
      `Location:         ${payload.location}\n` +
      `Role Applied For: ${payload.roleApplied}\n` +
      `Experience Level: ${payload.experience}\n` +
      `LinkedIn Profile: ${payload.linkedin}\n` +
      `Portfolio URL:    ${payload.portfolioUrl || "Not provided"}\n\n` +
      `SKILLS & TECHNOLOGIES\n` +
      `---------------------------------------------------\n` +
      `${payload.skills}\n\n` +
      `WHY KRAIT ABYSS\n` +
      `---------------------------------------------------\n` +
      `${payload.whyKraitAbyss}\n`;

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
            attachments: attachments.length > 0 ? attachments : undefined,
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
        applicationId,
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
