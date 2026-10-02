import type { Handler } from "@netlify/functions";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND_BOOKING_KEY || "";
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

    const phoneNum = payload.phone || `${payload.countryCode || ""} ${payload.phoneNumber || ""}`.trim();
    const dateStr = payload.preferredDate || payload.day || "Mon";
    const timeStr = payload.preferredTime || payload.timeSlot || "12:00 PM";
    const meetingType = payload.meetingType || "Quick Discovery Call";
    const duration = payload.callDuration || "15 min";
    const name = payload.fullName || "Portal Visitor";
    const userEmail = payload.email || "not-provided@kraitabyss.com";

    // 1. Supabase Database Logging (Server-side)
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/meetings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            user_id: `guest_${Date.now()}`,
            user_name: name,
            user_email: userEmail,
            meeting_type: meetingType,
            preferred_date: dateStr,
            preferred_time: timeStr,
            call_duration: duration,
            description: payload.description || `Phone: ${phoneNum} | Requested Day: ${dateStr} ${timeStr}`,
            status: "REQUESTED",
          }),
        });
      } catch (dbErr) {
        console.warn("[NETLIFY FUNCTION DB LOG ERROR]:", dbErr);
      }
    }

    // 2. Resend Email Dispatch
    const emailSubject = `[QUICK DISCOVERY CALL] ${meetingType} (${duration}) — ${phoneNum}`;
    const emailBody =
      `===================================================\n` +
      `          NEW CALL BOOKING REQUEST                \n` +
      `===================================================\n\n` +
      `Request ID:       ${requestId}\n` +
      `Meeting Type:     ${meetingType}\n` +
      `Duration:         ${duration}\n` +
      `Preferred Day:    ${dateStr}\n` +
      `Preferred Time:   ${timeStr}\n` +
      `Phone Number:     ${phoneNum}\n` +
      `Applicant Name:   ${name}\n` +
      `Email Address:    ${userEmail}\n` +
      `Company:          ${payload.company || "Not specified"}\n\n` +
      `NOTES / DETAILS:\n` +
      `${payload.description || "None provided"}\n`;

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
            reply_to: userEmail !== "not-provided@kraitabyss.com" ? userEmail : undefined,
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
