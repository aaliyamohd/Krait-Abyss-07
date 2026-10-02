import { supabase } from "@/integrations/supabase/client";

const RESEND_KEYS = {
  DISCOVERY: (import.meta.env.VITE_RESEND_DISCOVERY_KEY as string) || (import.meta.env.VITE_RESEND_API_KEY as string) || "",
  BOOKING: (import.meta.env.VITE_RESEND_BOOKING_KEY as string) || (import.meta.env.VITE_RESEND_API_KEY as string) || "",
  CAREERS: (import.meta.env.VITE_RESEND_CAREERS_KEY as string) || (import.meta.env.VITE_RESEND_API_KEY as string) || "",
};

const ADMIN_EMAIL = "kraitabyss07@gmail.com";

async function sendDirectResendEmail(apiKey: string, subject: string, textBody: string, replyTo?: string, attachments?: any[]) {
  try {
    const payload: any = {
      from: "Krait Abyss Portal <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject,
      text: textBody,
    };

    if (replyTo) {
      payload.reply_to = replyTo;
    }

    if (attachments && attachments.length > 0) {
      payload.attachments = attachments;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("[DIRECT RESEND DISPATCH SUCCESS]: Email sent to", ADMIN_EMAIL);
      return true;
    } else {
      const err = await res.text().catch(() => "");
      console.warn("[DIRECT RESEND NON-OK]:", res.status, err);
      return false;
    }
  } catch (e) {
    console.warn("[DIRECT RESEND ERROR]:", e);
    return false;
  }
}

export const resilientDispatchService = {
  /**
   * Submit Quick Discovery Call / Meeting Booking with dual-mode fallback
   */
  async submitCallBooking(payload: {
    day?: string;
    timeSlot?: string;
    preferredDate?: string;
    preferredTime?: string;
    callDuration?: string;
    meetingType?: string;
    countryCode?: string;
    phoneNumber?: string;
    phone?: string;
    fullName?: string;
    email?: string;
    company?: string;
    description?: string;
    turnstileToken?: string;
  }): Promise<{ success: boolean; requestId: string; error?: string }> {
    const requestId = `KA-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Try Backend API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("/api/contact/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const data = await response.json().catch(() => null);
        if (data?.success) {
          return { success: true, requestId: data.requestId || requestId };
        }
      }
    } catch (e) {
      console.log("[BACKEND API NOT AVAILABLE — USING CLIENT RESILIENT DISPATCH]:", e);
    }

    // 2. Client-side Resilient Fallback for Static Deployments (Netlify, Vercel, Cloudflare)
    const phoneNum = payload.phone || `${payload.countryCode || ""} ${payload.phoneNumber || ""}`.trim();
    const dateStr = payload.preferredDate || payload.day || "Mon";
    const timeStr = payload.preferredTime || payload.timeSlot || "12:00 PM";
    const meetingType = payload.meetingType || "Quick Discovery Call";
    const duration = payload.callDuration || "15 min";
    const name = payload.fullName || "Portal Visitor";
    const userEmail = payload.email || "not-provided@kraitabyss.com";

    // A. DB Log in Supabase
    try {
      await supabase.from("meetings").insert({
        user_id: `guest_${Date.now()}`,
        user_name: name,
        user_email: userEmail,
        meeting_type: meetingType,
        preferred_date: dateStr,
        preferred_time: timeStr,
        call_duration: duration,
        description: payload.description || `Phone: ${phoneNum} | Requested Day: ${dateStr} ${timeStr}`,
        status: "REQUESTED",
      });
    } catch (dbErr) {
      console.warn("[CLIENT DB FALLBACK LOG]:", dbErr);
    }

    // B. Direct Resend Email Dispatch
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

    await sendDirectResendEmail(RESEND_KEYS.BOOKING, emailSubject, emailBody, userEmail !== "not-provided@kraitabyss.com" ? userEmail : undefined);

    return { success: true, requestId };
  },

  /**
   * Submit Project Brief Specification with dual-mode fallback
   */
  async submitProjectBrief(payload: {
    fullName: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    serviceType?: string | null;
    selectedTier?: string | null;
    targetBudget?: string | null;
    timeline?: string | null;
    requestCustomDemo?: boolean | null;
    productUrl?: string | null;
    relevantLinks?: string | null;
    projectDescription: string;
    turnstileToken?: string;
  }): Promise<{ success: boolean; requestId: string; error?: string }> {
    const requestId = `KA-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Try Backend API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const data = await response.json().catch(() => null);
        if (data?.success) {
          return { success: true, requestId: data.requestId || requestId };
        }
      }
    } catch (e) {
      console.log("[BACKEND API NOT AVAILABLE — USING CLIENT RESILIENT DISPATCH]:", e);
    }

    // 2. Client-side Resilient Fallback for Static Deployments (Netlify, Vercel, Cloudflare)
    try {
      await supabase.from("projects").insert({
        name: `${payload.serviceType || "Project Request"} - ${payload.fullName}`,
        description: payload.projectDescription,
        service_type: payload.serviceType || "Software & SaaS",
        budget_range: payload.targetBudget || null,
        timeline: payload.timeline || null,
        status: "INTAKE_RECEIVED",
        company: payload.company || null,
        user_email: payload.email,
        user_name: payload.fullName,
      });
    } catch (dbErr) {
      console.warn("[CLIENT DB FALLBACK LOG]:", dbErr);
    }

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

    await sendDirectResendEmail(RESEND_KEYS.DISCOVERY, emailSubject, emailBody, payload.email);

    return { success: true, requestId };
  },

  /**
   * Submit Job Application with dual-mode fallback
   */
  async submitCareerApplication(payload: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    roleApplied: string;
    linkedin: string;
    portfolioUrl?: string;
    experience: string;
    skills: string;
    whyKraitAbyss: string;
    resume?: {
      fileName: string;
      fileType: string;
      fileSize: number;
      base64Data: string;
    };
  }): Promise<{ success: boolean; applicationId?: string; error?: string }> {
    const applicationId = `app-${Date.now()}`;

    // 1. Try Backend API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const data = await response.json().catch(() => null);
        if (data?.success) {
          return { success: true, applicationId: data.applicationId || applicationId };
        }
      }
    } catch (e) {
      console.log("[BACKEND API NOT AVAILABLE — USING CLIENT RESILIENT DISPATCH]:", e);
    }

    // 2. Client-side Resilient Fallback for Static Deployments (Netlify, Vercel, Cloudflare)
    try {
      await supabase.from("career_applications").insert({
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        location: payload.location,
        role_applied: payload.roleApplied,
        portfolio_url: payload.portfolioUrl || null,
        cover_note: `Experience: ${payload.experience}\nLinkedIn: ${payload.linkedin}\nSkills: ${payload.skills}\nWhy: ${payload.whyKraitAbyss}`,
        resume_url: payload.resume?.fileName || "uploaded_resume",
      });
    } catch (dbErr) {
      console.warn("[CLIENT DB FALLBACK LOG]:", dbErr);
    }

    let attachments: any[] = [];
    if (payload.resume && payload.resume.base64Data && payload.resume.fileName) {
      const cleanBase64 = payload.resume.base64Data.replace(/^data:[^;]+;base64,/, "");
      attachments.push({
        filename: payload.resume.fileName.replace(/[^\w.-]/g, "_"),
        content: cleanBase64,
      });
    }

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

    await sendDirectResendEmail(RESEND_KEYS.CAREERS, emailSubject, emailBody, payload.email, attachments);

    return { success: true, applicationId };
  },
};
