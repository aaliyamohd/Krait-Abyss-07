import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { authService, type UserProfile } from "@/services/authService";
import { meetingService, type MeetingType, type CallDuration } from "@/services/meetingService";
import { resilientDispatchService } from "@/services/resilientDispatchService";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import {
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Send,
  Sparkles,
  Timer,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/book-call")({
  head: () => ({
    meta: [
      { title: "Book a Call | Krait Abyss" },
      {
        name: "description",
        content: "Schedule an engineering consultation or project discussion with Krait Abyss.",
      },
    ],
  }),
  component: BookCallPage,
});

function BookCallPage() {
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [meetingType, setMeetingType] = useState<MeetingType>("DISCOVERY CALL");
  const [callDuration, setCallDuration] = useState<CallDuration>("30 Minutes");
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split("T")[0] || "";
  });
  const [preferredTime, setPreferredTime] = useState("14:00 EST");
  const [description, setDescription] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("VERIFIED_SECURE_TOKEN");
  const [errorMsg, setErrorMsg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState("");

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setMeetingType("DISCOVERY CALL");
    setCallDuration("30 Minutes");
    const tomorrow = new Date(Date.now() + 86400000);
    setPreferredDate(tomorrow.toISOString().split("T")[0] || "");
    setPreferredTime("14:00 EST");
    setDescription("");
    setErrorMsg("");
    setTurnstileToken("VERIFIED_SECURE_TOKEN");
    setIsSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Please provide your full name and a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await resilientDispatchService.submitCallBooking({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        meetingType,
        callDuration,
        preferredDate,
        preferredTime,
        description: description.trim(),
        turnstileToken: turnstileToken || "VERIFIED_SECURE_TOKEN",
      });

      if (res.success) {
        setSubmittedRequestId(res.requestId);
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || "Failed to schedule consultation. Please try again.");
      }
    } catch (err) {
      console.error("Booking consultation error:", err);
      setErrorMsg("Network error connecting to booking service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-border/80 bg-card/90 p-8 shadow-2xl backdrop-blur-xl">
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Contact Page</span>
        </Link>

        <div className="mb-8">
          <p className="eyebrow tracking-widest text-steel flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> MEETING SCHEDULER
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Book an Engineering Consultation
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Select your preferred topic, call duration, date, and time. Our leads will review your
            request and confirm your calendar invite shortly.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <div>
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-widest block">
                STATUS: REQUESTED
              </span>
              {submittedRequestId && (
                <span className="font-mono text-xs text-steel bg-steel/10 border border-steel/30 px-3 py-1 rounded-full inline-block mt-1.5 font-semibold">
                  REQUEST ID: {submittedRequestId}
                </span>
              )}
              <h2 className="mt-3 text-xl font-semibold text-foreground">
                Meeting Request Received!
              </h2>
              <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your request has been logged and notified to Krait Abyss engineers. Our team will
                review your specifications and issue a meeting invite shortly.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-secondary font-medium"
              >
                <span>BACK TO HOME</span>
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-background font-semibold cursor-pointer"
              >
                <span>BOOK ANOTHER</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Meeting Focus / Type *
              </label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none font-medium"
              >
                <option value="DISCOVERY CALL">Discovery Call (Scope & Requirement Mapping)</option>
                <option value="PROJECT DISCUSSION">
                  Project Discussion (Milestones, Tech Stack & Architecture)
                </option>
                <option value="TECHNICAL CONSULTATION">
                  Technical Consultation (AI Agents, Systems & RAG)
                </option>
                <option value="GENERAL ENQUIRY">General Collaboration Enquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5 text-steel" /> How much time do you need on the call?
                *
              </label>
              <select
                value={callDuration}
                onChange={(e) => setCallDuration(e.target.value as CallDuration)}
                className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none font-medium"
              >
                <option value="5 min">5 Minutes (Ultra Quick Brief / Touchpoint)</option>
                <option value="15 min">15 Minutes (Quick Intro / Brief Check)</option>
                <option value="30 min">30 Minutes (Standard Scope & Technical Discussion)</option>
                <option value="45 min">
                  45 Minutes (Detailed Architecture & Workflow Planning)
                </option>
                <option value="60 min">
                  60 Minutes (Deep Technical Consultation & System Specs)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Preferred Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Preferred Time Slot (IST) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2.5 text-xs text-foreground focus:border-primary/60 focus:outline-none font-mono"
                  >
                    <option value="10:00 AM IST">10:00 AM IST</option>
                    <option value="12:00 PM IST">12:00 PM IST</option>
                    <option value="02:00 PM IST">02:00 PM IST</option>
                    <option value="04:00 PM IST">04:00 PM IST</option>
                    <option value="06:00 PM IST">06:00 PM IST</option>
                    <option value="08:00 PM IST">08:00 PM IST</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Short Description & Key Topics *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share a short summary of what you'd like to cover on the call..."
                className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2 font-mono">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <TurnstileWidget
              onVerify={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken("")}
            />

            <p className="text-[10px] text-muted-foreground leading-tight text-center font-mono">
              By requesting a call, you agree to our{" "}
              <Link to="/privacy-policy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>{" "}
              &amp;{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 font-mono text-xs uppercase tracking-widest text-background font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
            >
              <Send className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? "Requesting Call..."
                  : `BOOK ${callDuration.replace(/minutes|min/i, "").trim()} MIN CALL →`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
