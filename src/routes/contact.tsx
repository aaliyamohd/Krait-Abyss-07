import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { ContactRobotVisual } from "@/components/site/ContactRobotVisual";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { site } from "@/data/site";
import { authService, type UserProfile } from "@/services/authService";
import { projectService } from "@/services/projectService";
import { meetingService, type MeetingType, type CallDuration } from "@/services/meetingService";
import { resilientDispatchService } from "@/services/resilientDispatchService";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ArrowRight,
  Mail,
  Send,
  MessageCircle,
  MessageSquare,
  Sparkles,
  MapPin,
  LayoutDashboard,
  User,
  Building,
  Phone,
  Globe,
  Paperclip,
  Check,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { service?: string } => {
    const s = search["service"];
    return s ? { service: String(s) } : {};
  },
  head: () => ({
    meta: [
      { title: "Contact & Work With Us — Krait Abyss" },
      {
        name: "description",
        content:
          "Tell us what you are building. Submit your project brief or schedule an engineering consultation with Krait Abyss.",
      },
      { property: "og:title", content: "Contact & Work With Us — Krait Abyss" },
      {
        property: "og:description",
        content:
          "Build an AI system, automate a workflow, launch a SaaS product, or bring a technical idea to life.",
      },
    ],
  }),
  component: ContactPage,
});

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export interface CountryOption {
  name: string;
  code: string;
  flag: string;
  short: string;
  minDigits: number;
  maxDigits: number;
  placeholder: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { name: "India", code: "+91", flag: "🇮🇳", short: "IN", minDigits: 10, maxDigits: 10, placeholder: "10-digit number" },
  { name: "United States", code: "+1", flag: "🇺🇸", short: "US", minDigits: 10, maxDigits: 10, placeholder: "10-digit number" },
  {
    name: "United Arab Emirates",
    code: "+971",
    flag: "🇦🇪",
    short: "UAE",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "9-digit number",
  },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", short: "KSA", minDigits: 9, maxDigits: 9, placeholder: "9-digit number" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", short: "UK", minDigits: 10, maxDigits: 11, placeholder: "10-11 digits" },
  { name: "Canada", code: "+1", flag: "🇨🇦", short: "CA", minDigits: 10, maxDigits: 10, placeholder: "10-digit number" },
  { name: "Australia", code: "+61", flag: "🇦🇺", short: "AU", minDigits: 9, maxDigits: 10, placeholder: "9-10 digits" },
  { name: "Germany", code: "+49", flag: "🇩🇪", short: "DE", minDigits: 10, maxDigits: 11, placeholder: "10-11 digits" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭", short: "CH", minDigits: 9, maxDigits: 10, placeholder: "9-10 digits" },
  { name: "Qatar", code: "+974", flag: "🇶🇦", short: "QA", minDigits: 8, maxDigits: 8, placeholder: "8-digit number" },
  { name: "Singapore", code: "+65", flag: "🇸🇬", short: "SG", minDigits: 8, maxDigits: 8, placeholder: "8-digit number" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼", short: "KW", minDigits: 8, maxDigits: 8, placeholder: "8-digit number" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱", short: "NL", minDigits: 9, maxDigits: 10, placeholder: "9-10 digits" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭", short: "BH", minDigits: 8, maxDigits: 8, placeholder: "8-digit number" },
  { name: "Norway", code: "+47", flag: "🇳🇴", short: "NO", minDigits: 8, maxDigits: 8, placeholder: "8-digit number" },
  { name: "Sweden", code: "+46", flag: "🇸🇪", short: "SE", minDigits: 9, maxDigits: 10, placeholder: "9-10 digits" },
  { name: "Oman", code: "+968", flag: "🇴🇲", short: "OM", minDigits: 8, maxDigits: 8, placeholder: "8-digit number" },
  { name: "France", code: "+33", flag: "🇫🇷", short: "FR", minDigits: 9, maxDigits: 9, placeholder: "9-digit number" },
  { name: "Japan", code: "+81", flag: "🇯🇵", short: "JP", minDigits: 10, maxDigits: 11, placeholder: "10-11 digits" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺", short: "LU", minDigits: 9, maxDigits: 9, placeholder: "9-digit number" },
  { name: "South Korea", code: "+82", flag: "🇰🇷", short: "KR", minDigits: 9, maxDigits: 11, placeholder: "9-11 digits" },
  { name: "Other", code: "+", flag: "🌐", short: "INT", minDigits: 7, maxDigits: 15, placeholder: "Phone number" },
];

const TIME_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
];

export interface CurrencyOption {
  symbol: string;
  code: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { symbol: "₹", code: "INR", label: "₹ INR" },
  { symbol: "$", code: "USD", label: "$ USD" },
  { symbol: "€", code: "EUR", label: "€ EUR" },
  { symbol: "£", code: "GBP", label: "£ GBP" },
  { symbol: "AED", code: "AED", label: "AED" },
  { symbol: "SAR", code: "SAR", label: "SAR" },
  { symbol: "C$", code: "CAD", label: "C$ CAD" },
  { symbol: "A$", code: "AUD", label: "A$ AUD" },
  { symbol: "CHF", code: "CHF", label: "CHF" },
  { symbol: "QAR", code: "QAR", label: "QAR" },
  { symbol: "S$", code: "SGD", label: "S$ SGD" },
  { symbol: "KWD", code: "KWD", label: "KWD" },
  { symbol: "BHD", code: "BHD", label: "BHD" },
  { symbol: "NOK", code: "NOK", label: "NOK" },
  { symbol: "SEK", code: "SEK", label: "SEK" },
  { symbol: "OMR", code: "OMR", label: "OMR" },
  { symbol: "¥", code: "JPY", label: "¥ JPY" },
  { symbol: "₩", code: "KRW", label: "₩ KRW" },
];

const SERVICE_OPTIONS = [
  "AI/ML Solutions",
  "AI Custom Solutions",
  "Website & App Development",
  "Software & SaaS",
  "Design & Creative",
  "Business & Operations",
  "Other (Custom Solution)",
];

const TIMELINE_OPTIONS = ["Flexible", "ASAP (< 2 Weeks)", "1–2 months", "2–4 months", "4+ months"];

type TierType = "starter" | "growth" | "enterprise";

interface TierInfo {
  id: TierType;
  tag: string;
  title: string;
  desc: string;
  badge: string;
  deliverables: string[];
}

const TIERS: Record<TierType, TierInfo> = {
  starter: {
    id: "starter",
    tag: "STARTER",
    title: "Starter / MVP",
    desc: "Focuses on validation, rapid prototyping, and core workflows.",
    badge: "MVP & Automation Starter",
    deliverables: [
      "Interactive Design System & Figma files",
      "Functional frontend prototype (React / Vite)",
      "Backend automation API integration",
      "Basic LLM setup or data pipeline setup",
      "Deployment to test server + documentation",
    ],
  },
  growth: {
    id: "growth",
    tag: "GROWTH",
    title: "Growth / Scale",
    desc: "Full-scale SaaS platforms, advanced custom AI integrations.",
    badge: "Growth & Scale System",
    deliverables: [
      "Full-scale SaaS platform & production frontend",
      "Advanced custom AI integrations & multi-agent flows",
      "Scalable database & backend microservices",
      "Automated CI/CD deployment & monitoring",
      "Comprehensive documentation & team onboarding",
    ],
  },
  enterprise: {
    id: "enterprise",
    tag: "ENTERPRISE",
    title: "Enterprise / Custom",
    desc: "Large-scale system architectures, custom AI models, custom SLAs.",
    badge: "Enterprise Ecosystem",
    deliverables: [
      "Custom AI models, fine-tuning & RAG architectures",
      "High-concurrency microservices & cloud infrastructure",
      "Dedicated SLA, 24/7 security auditing & compliance",
      "Custom integrations, legacy database migrations & API gateways",
      "White-glove engineering support & full IP transfer",
    ],
  },
};

function ContactPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const getInitialServiceType = (serviceParam?: string) => {
    switch (serviceParam) {
      case "ai-ml":
        return "AI/ML Solutions";
      case "ai-custom":
        return "AI Custom Solutions";
      case "website-digital":
        return "Website & App Development";
      case "software-saas":
        return "Software & SaaS";
      case "design-creative":
        return "Design & Creative";
      case "business-operations":
        return "Business & Operations";
      default:
        return "Software & SaaS";
    }
  };

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    authService.getCurrentUser(),
  );

  // ----------------------------------------------------
  // LEFT COLUMN: SCHEDULER STATES
  // ----------------------------------------------------
  const [selectedDay, setSelectedDay] = useState<string>("Mon");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("12:00 PM");
  const [selectedCountryIndex, setSelectedCountryIndex] = useState<number>(0);
  const [countryCode, setCountryCode] = useState<string>(COUNTRY_OPTIONS[0]!.code);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isBookingCall, setIsBookingCall] = useState(false);
  const [meetingConfirmed, setMeetingConfirmed] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState("");
  const [callTurnstileToken, setCallTurnstileToken] = useState("VERIFIED_SECURE_TOKEN");
  const [callErrorMsg, setCallErrorMsg] = useState("");

  const handleCountryChange = (index: number) => {
    setSelectedCountryIndex(index);
    const country = COUNTRY_OPTIONS[index];
    if (country) {
      setCountryCode(country.code);
    }
  };

  // ----------------------------------------------------
  // RIGHT COLUMN: PROJECT SCOPE STATES (NO AUTOFILL)
  // ----------------------------------------------------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [serviceType, setServiceType] = useState(() => getInitialServiceType(search?.service));
  const [selectedTier, setSelectedTier] = useState<TierType | "">("");
  const [targetBudget, setTargetBudget] = useState("");
  const [requestCustomDemo, setRequestCustomDemo] = useState<boolean | null>(null);
  const [timeline, setTimeline] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [relevantLinks, setRelevantLinks] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSubmittingBrief, setIsSubmittingBrief] = useState(false);
  const [briefSubmitted, setBriefSubmitted] = useState(false);
  const [briefTurnstileToken, setBriefTurnstileToken] = useState("VERIFIED_SECURE_TOKEN");
  const [briefErrorMsg, setBriefErrorMsg] = useState("");

  const resetCallForm = () => {
    setSelectedDay("Mon");
    setSelectedTimeSlot("12:00 PM");
    setSelectedCountryIndex(0);
    setCountryCode(COUNTRY_OPTIONS[0]!.code);
    setPhoneNumber("");
    setCallErrorMsg("");
    setCallTurnstileToken("VERIFIED_SECURE_TOKEN");
    setMeetingConfirmed(false);
  };

  const resetBriefForm = () => {
    setFullName("");
    setEmail("");
    setCompany("");
    setFormPhone("");
    setCurrencySymbol("₹");
    setServiceType(getInitialServiceType(search?.service));
    setSelectedTier("");
    setTargetBudget("");
    setRequestCustomDemo(null);
    setTimeline("");
    setProductUrl("");
    setRelevantLinks("");
    setProjectDescription("");
    setBriefErrorMsg("");
    setBriefTurnstileToken("VERIFIED_SECURE_TOKEN");
    setBriefSubmitted(false);
  };

  useEffect(() => {
    if (search?.service) {
      setServiceType(getInitialServiceType(search.service));
    }
  }, [search?.service]);

  // ----------------------------------------------------
  // MEETING BOOKING LOGIC (DISPATCH EMAIL TO ADMIN)
  // ----------------------------------------------------
  const handleScheduleCallClick = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCallErrorMsg("");

    const rawNum = phoneNumber.trim();
    if (!rawNum) {
      setCallErrorMsg("Please enter your phone number to book a 15-minute call.");
      return;
    }

    const country = (COUNTRY_OPTIONS[selectedCountryIndex] || COUNTRY_OPTIONS[0])!;
    const digitsOnly = rawNum.replace(/\D/g, "");

    if (digitsOnly.length < country.minDigits || digitsOnly.length > country.maxDigits) {
      if (country.minDigits === country.maxDigits) {
        setCallErrorMsg(`Please enter a valid ${country.minDigits}-digit phone number for ${country.name}.`);
      } else {
        setCallErrorMsg(`Please enter a valid ${country.minDigits}-${country.maxDigits} digit phone number for ${country.name}.`);
      }
      return;
    }

    setIsBookingCall(true);
    const fullPhone = `${countryCode} ${rawNum}`;

    try {
      const res = await resilientDispatchService.submitCallBooking({
        day: selectedDay,
        timeSlot: selectedTimeSlot,
        preferredDate: selectedDay,
        preferredTime: selectedTimeSlot,
        callDuration: "15 min",
        meetingType: "Quick Discovery Call",
        countryCode,
        phoneNumber: rawNum,
        phone: fullPhone,
        turnstileToken: callTurnstileToken || "VERIFIED_SECURE_TOKEN",
      });

      if (res.success) {
        setSubmittedRequestId(res.requestId);
        setMeetingConfirmed(true);
      } else {
        setCallErrorMsg(res.error || "Failed to process call booking. Please try again.");
      }
    } catch (backendErr) {
      console.error("Call booking dispatch error", backendErr);
      setCallErrorMsg("Network error connecting to booking service. Please try again.");
    } finally {
      setIsBookingCall(false);
    }
  };

  // ----------------------------------------------------
  // BRIEF SUBMISSION LOGIC (DISPATCH EMAIL TO ADMIN)
  // ----------------------------------------------------
  const handleBriefSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanSubmittedName = fullName.trim();
    const cleanSubmittedEmail = email.trim();
    const cleanSubmittedDesc = projectDescription.trim();

    if (!cleanSubmittedName || !cleanSubmittedEmail || !formPhone.trim() || !cleanSubmittedDesc) {
      setBriefErrorMsg("Please fill out your full name, email address, phone number, and project brief.");
      return;
    }

    if (!briefTurnstileToken) {
      setBriefErrorMsg("Please complete the Cloudflare security verification challenge.");
      return;
    }

    setBriefErrorMsg("");
    setIsSubmittingBrief(true);
    const fullFormPhone = formPhone.trim() ? `${countryCode} ${formPhone}`.trim() : null;
    const budgetInfo = targetBudget.trim() ? `${currencySymbol} ${targetBudget}` : null;

    try {
      const res = await resilientDispatchService.submitProjectBrief({
        fullName: cleanSubmittedName,
        email: cleanSubmittedEmail,
        phone: fullFormPhone,
        company: company.trim() || null,
        serviceType: serviceType || null,
        selectedTier: selectedTier || null,
        targetBudget: budgetInfo,
        timeline: timeline.trim() || null,
        requestCustomDemo: requestCustomDemo,
        productUrl: productUrl.trim() || null,
        relevantLinks: relevantLinks.trim() || null,
        projectDescription: cleanSubmittedDesc,
        turnstileToken: briefTurnstileToken || "VERIFIED_SECURE_TOKEN",
      });

      if (res.success) {
        setSubmittedRequestId(res.requestId);
        setBriefSubmitted(true);
      } else {
        setBriefErrorMsg(res.error || "Failed to submit project specifications. Please try again.");
      }
    } catch (err) {
      console.error("Resend brief backend dispatch error", err);
      setBriefErrorMsg("Network error submitting brief. Please check your connection.");
    } finally {
      setIsSubmittingBrief(false);
    }
  };

  const currentTierInfo = selectedTier ? TIERS[selectedTier] : TIERS.starter;

  return (
    <div className="py-12 md:py-20 text-foreground">
      <div className="mx-auto max-w-6xl px-5">
        {/* ── INTRO SECTION ───────────────────────────────────────────── */}
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow text-steel tracking-[0.25em] font-mono text-xs font-semibold uppercase">
            GET IN TOUCH
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            Have an idea? Let's build it.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Ready to design a new system, integrate generative AI into your database, or scope a
            SaaS workflow? Book a call directly or submit a specifications form below.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/krait-abyss-35b390432/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-border/80 bg-card/90 px-4 py-2 font-mono text-xs text-foreground font-semibold hover:border-accent hover:bg-accent/10 transition-all shadow-sm group"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded bg-[#0A66C2] text-[0.55rem] font-bold text-white">
                in
              </span>
              <span>LinkedIn Profile: Krait Abyss</span>
              <span className="text-accent font-mono text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                ↗
              </span>
            </a>
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT ───────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* LEFT COLUMN: STUDIO CHANNELS, QUICK DISCOVERY CALL & 3D ROTARY GLOBE CORE */}
          <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
            {/* 1. STUDIO CHANNELS CARD */}
            <div className="surface-panel p-5 rounded-2xl border border-border/80 bg-card/90 space-y-4">
              <h3 className="font-semibold text-sm text-foreground">Studio Channels</h3>

              <div className="space-y-3.5 text-xs font-mono">
                {/* Direct Email */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-steel/10 border border-steel/20 text-steel shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Direct Email
                    </span>
                    <a
                      href="mailto:kraitabyss07@gmail.com"
                      className="text-foreground font-medium hover:underline"
                    >
                      kraitabyss07@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-steel/10 border border-steel/20 text-steel shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Phone & WhatsApp
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={site.phoneUrl}
                        className="text-foreground font-semibold hover:underline font-mono"
                      >
                        {site.phone}
                      </a>
                      <a
                        href={site.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-steel text-[11px] font-semibold hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>(WhatsApp)</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-[#0A66C2] shrink-0 font-bold font-mono text-xs">
                    in
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      LinkedIn Profile
                    </span>
                    <a
                      href="https://www.linkedin.com/in/krait-abyss-35b390432/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>krait-abyss</span>
                      <span className="text-steel text-[10px]">↗</span>
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-steel/10 border border-steel/20 text-steel shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      LOCATION
                    </span>
                    <span className="text-foreground font-semibold">Remote (Hyderabad, India)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. QUICK DISCOVERY CALL CARD */}
            <div className="surface-panel p-5 rounded-2xl border border-border/80 bg-card/90 space-y-4">
              {meetingConfirmed ? (
                <div className="py-6 text-center space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-steel/10 border border-steel/30 text-steel">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-steel font-bold uppercase tracking-widest block">
                      STATUS: REQUESTED
                    </span>
                    {submittedRequestId && (
                      <span className="font-mono text-[10px] text-steel bg-steel/10 border border-steel/30 px-2 py-0.5 rounded-full inline-block mt-1 font-semibold">
                        REQUEST ID: {submittedRequestId}
                      </span>
                    )}
                    <h3 className="mt-1.5 text-base font-semibold text-foreground">
                      15 min Discovery Call Requested
                    </h3>
                    <p className="mt-1 font-mono text-xs text-steel">
                      Upcoming {selectedDay} at {selectedTimeSlot} IST
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Your request has been logged. Our team will review your availability and send a
                    calendar invite shortly.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-secondary font-medium"
                    >
                      <span>BACK TO HOME</span>
                    </Link>
                    <button
                      type="button"
                      onClick={resetCallForm}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-background font-semibold cursor-pointer"
                    >
                      <span>BOOK ANOTHER</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleScheduleCallClick} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-steel" />
                      <h3 className="font-semibold text-sm text-foreground">
                        Quick Discovery Call
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-steel bg-steel/10 border border-steel/30 px-2 py-0.5 rounded-full font-medium">
                      15 min chat
                    </span>
                  </div>

                  {/* 1. SELECT A DAY */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      1. SELECT A DAY
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {WEEKDAYS.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`py-2 text-center font-mono text-xs rounded-xl border transition-all ${
                            selectedDay === day
                              ? "border-foreground bg-foreground text-background font-bold shadow-sm"
                              : "border-border/60 bg-background/50 text-muted-foreground hover:border-steel/40 hover:text-foreground"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. SELECT TIME (IST) - TYPE OR CHOOSE */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      2. SELECT TIME (IST) - TYPE OR CHOOSE
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-border/80 bg-background/60 pl-9 pr-8 py-2.5 text-xs text-foreground font-mono focus:border-steel/60 focus:outline-none"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-muted-foreground text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* 3. CALL COORDINATES */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      3. CALL COORDINATES (COUNTRY &amp; PHONE)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-6 relative">
                        <select
                          value={selectedCountryIndex}
                          onChange={(e) => handleCountryChange(Number(e.target.value))}
                          className="w-full appearance-none rounded-xl border border-border/80 bg-background/60 pl-3 pr-7 py-2.5 text-xs text-foreground font-mono focus:border-steel/60 focus:outline-none truncate"
                        >
                          {COUNTRY_OPTIONS.map((c, i) => (
                            <option
                              key={`${c.short}-${i}`}
                              value={i}
                              className="bg-card text-foreground py-1"
                            >
                              {c.flag} {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2.5 top-3.5 pointer-events-none text-muted-foreground text-[10px]">
                          ▼
                        </div>
                      </div>
                      <div className="sm:col-span-6 relative flex items-center">
                        <span className="absolute left-3 font-mono text-xs text-steel font-bold pointer-events-none select-none z-10">
                          {countryCode}
                        </span>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^\d\s-]/g, "");
                            const country = (COUNTRY_OPTIONS[selectedCountryIndex] || COUNTRY_OPTIONS[0])!;
                            const digitsOnly = val.replace(/\D/g, "");
                            if (digitsOnly.length <= country.maxDigits) {
                              setPhoneNumber(val);
                            }
                          }}
                          placeholder={COUNTRY_OPTIONS[selectedCountryIndex]?.placeholder || "Enter phone number"}
                          className={`w-full rounded-xl border border-border/80 bg-background/60 pr-3 py-2.5 text-xs text-foreground font-mono placeholder:text-muted-foreground/30 focus:border-steel/60 focus:outline-none ${
                            countryCode.length >= 4
                              ? "pl-16"
                              : countryCode.length >= 3
                                ? "pl-14"
                                : "pl-10"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {callErrorMsg && (
                    <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-2.5 text-xs text-rose-400 flex items-center gap-2 font-mono mt-2">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>{callErrorMsg}</span>
                    </div>
                  )}

                  <TurnstileWidget
                    onVerify={(token) => setCallTurnstileToken(token)}
                    onExpire={() => setCallTurnstileToken("")}
                  />

                  <p className="text-[10px] text-muted-foreground leading-tight text-center font-mono">
                    By booking, you agree to our{" "}
                    <Link to="/privacy-policy" className="underline hover:text-foreground">
                      Privacy Policy
                    </Link>{" "}
                    &amp;{" "}
                    <Link to="/terms" className="underline hover:text-foreground">
                      Terms
                    </Link>
                    .
                  </p>

                  {/* ACTION BUTTON */}
                  <button
                    type="submit"
                    disabled={isBookingCall}
                    className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 font-mono text-xs uppercase tracking-widest text-background font-semibold transition-all hover:opacity-90 disabled:opacity-50 shadow-lg cursor-pointer"
                  >
                    <span>{isBookingCall ? "Scheduling Call..." : "BOOK 15 MIN CALL →"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* 3. WIREFRAME DOTTED GLOBE CORE (EQUAL HEIGHT VISUAL STACK) */}
            <div className="surface-panel p-5 rounded-2xl border border-border/80 bg-card/90 space-y-3 flex-1 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-mono text-[10px] text-steel font-bold uppercase tracking-widest">
                  3D ROTARY GLOBE CORE
                </span>
                <span className="font-mono text-[9px] bg-steel/10 text-steel px-2 py-0.5 rounded border border-steel/30 font-semibold">
                  SYNAPSE LATTICE
                </span>
              </div>
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/80 border border-border/40 min-h-[320px]">
                <RotatingEarth className="w-full h-full min-h-[320px]" />
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[10px] text-muted-foreground">
                <span className="uppercase tracking-wider">ROTATIONAL ECOSYSTEM</span>
                <span className="text-steel flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-steel animate-pulse inline-block" />
                  ACTIVE 60 FPS
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DEFINE PROJECT SCOPE FORM */}
          <div className="lg:col-span-7">
            <div className="surface-panel p-6 sm:p-7 rounded-2xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl space-y-5">
              <div className="border-b border-border/60 pb-3">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Define Project Scope
                </h2>
              </div>

              {briefSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-steel/10 border border-steel/30 text-steel">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-steel font-bold uppercase tracking-widest block">
                      STATUS: REQUESTED
                    </span>
                    {submittedRequestId && (
                      <span className="font-mono text-xs text-steel bg-steel/10 border border-steel/30 px-3 py-1 rounded-full inline-block mt-1.5 font-semibold">
                        REQUEST ID: {submittedRequestId}
                      </span>
                    )}
                    <h3 className="mt-3 text-xl font-semibold text-foreground">
                      PROJECT BRIEF RECEIVED
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Thank you — your project specifications have been submitted securely to Krait
                      Abyss engineers. Our team will review your brief and contact you within 24
                      hours.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-secondary font-medium"
                    >
                      <span>BACK TO HOME</span>
                    </Link>
                    <button
                      type="button"
                      onClick={resetBriefForm}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-background font-semibold cursor-pointer"
                    >
                      <span>Submit another brief</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBriefSubmit} className="space-y-5">
                  {/* FULL NAME & EMAIL ADDRESS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        FULL NAME *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full rounded-xl border border-border/80 bg-background/60 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        EMAIL ADDRESS *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@email.com"
                          className="w-full rounded-xl border border-border/80 bg-background/60 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* COMPANY & PHONE (OPTIONAL DETAILS) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        COMPANY / STARTUP (OPTIONAL)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Tech Labs"
                          className="w-full rounded-xl border border-border/80 bg-background/60 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        PHONE NUMBER *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-6 relative">
                          <select
                            value={selectedCountryIndex}
                            onChange={(e) => handleCountryChange(Number(e.target.value))}
                            className="w-full appearance-none rounded-xl border border-border/80 bg-background/60 pl-3 pr-7 py-2.5 text-xs text-foreground font-mono focus:border-steel/60 focus:outline-none truncate"
                          >
                            {COUNTRY_OPTIONS.map((c, i) => (
                              <option
                                key={`scope-${c.short}-${i}`}
                                value={i}
                                className="bg-card text-foreground py-1"
                              >
                                {c.flag} {c.name} ({c.code})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-2.5 top-3.5 pointer-events-none text-muted-foreground text-[10px]">
                            ▼
                          </div>
                        </div>
                        <div className="sm:col-span-6 relative flex items-center">
                          <span className="absolute left-3 font-mono text-xs text-steel font-bold pointer-events-none select-none z-10">
                            {countryCode}
                          </span>
                          <input
                            type="tel"
                            required
                            value={formPhone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^\d\s-]/g, "");
                              const country = (COUNTRY_OPTIONS[selectedCountryIndex] || COUNTRY_OPTIONS[0])!;
                              const digitsOnly = val.replace(/\D/g, "");
                              if (digitsOnly.length <= country.maxDigits) {
                                setFormPhone(val);
                              }
                            }}
                            placeholder={
                              COUNTRY_OPTIONS[selectedCountryIndex]?.placeholder || "10-digit number"
                            }
                            className={`w-full rounded-xl border border-border/80 bg-background/60 pr-3.5 py-2.5 text-xs text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none ${
                              countryCode.length >= 4
                                ? "pl-16"
                                : countryCode.length >= 3
                                  ? "pl-14"
                                  : "pl-10"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WHAT ARE YOU LOOKING TO BUILD? */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      WHAT ARE YOU LOOKING TO BUILD? (SELECT OR TYPE) *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-border/80 bg-background/60 pl-10 pr-8 py-2.5 text-xs text-foreground focus:border-steel/60 focus:outline-none font-medium"
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-3.5 pointer-events-none text-muted-foreground text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* TIER TARGET SELECT */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      TIER TARGET SELECT
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(Object.keys(TIERS) as TierType[]).map((tierKey) => {
                        const tier = TIERS[tierKey];
                        const isSelected = selectedTier === tierKey;
                        return (
                          <button
                            key={tierKey}
                            type="button"
                            onClick={() => setSelectedTier(tierKey)}
                            className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between ${
                              isSelected
                                ? "border-foreground bg-background/90 text-foreground shadow-md ring-1 ring-steel/40"
                                : "border-border/60 bg-background/40 text-muted-foreground hover:border-steel/40 hover:text-foreground"
                            }`}
                          >
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-wider text-steel font-semibold block mb-1">
                                {tier.tag}
                              </span>
                              <h4 className="font-semibold text-xs text-foreground mb-1">
                                {tier.title}
                              </h4>
                              <p className="text-[11px] leading-tight text-muted-foreground">
                                {tier.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SPECIFY TARGET BUDGET & TIMELINE */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <div className="sm:col-span-7">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          SPECIFY TARGET BUDGET (WHAT YOU CAN AFFORD)
                        </label>
                      </div>
                      <div className="relative flex items-center">
                        <select
                          value={currencySymbol}
                          onChange={(e) => setCurrencySymbol(e.target.value)}
                          className="rounded-l-xl border border-r-0 border-border/80 bg-background/80 px-2.5 py-2.5 text-xs text-foreground font-mono focus:border-steel/60 focus:outline-none"
                        >
                          {CURRENCY_OPTIONS.map((c) => (
                            <option key={c.code} value={c.symbol}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={targetBudget}
                          onChange={(e) => setTargetBudget(e.target.value)}
                          placeholder="e.g. 2,50,000 or 5,000"
                          className="w-full rounded-r-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        TARGET TIMELINE *
                      </label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2.5 text-xs text-foreground focus:border-steel/60 focus:outline-none"
                      >
                        {TIMELINE_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Please enter the budget you can afford so we can tailor the system design to
                    your constraints. You should also contact us to request a live demo and a
                    complete scope estimate.
                  </p>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(requestCustomDemo)}
                      onChange={(e) => setRequestCustomDemo(e.target.checked)}
                      className="rounded border-border/80 bg-background/80 text-steel focus:ring-0 h-3.5 w-3.5"
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      Request a custom demo &amp; detailed cost estimate instead
                    </span>
                  </label>

                  {/* WEBSITE / PRODUCT URL & REFERENCE LINKS (OPTIONAL) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        WEBSITE / PRODUCT URL (OPTIONAL)
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        <input
                          type="url"
                          value={productUrl}
                          onChange={(e) => setProductUrl(e.target.value)}
                          placeholder="https://yourcompany.com"
                          className="w-full rounded-xl border border-border/80 bg-background/60 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                        REFERENCE LINKS / SPECS / FIGMA (OPTIONAL)
                      </label>
                      <div className="relative">
                        <Paperclip className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        <input
                          type="text"
                          value={relevantLinks}
                          onChange={(e) => setRelevantLinks(e.target.value)}
                          placeholder="figma.com/... or PRD link"
                          className="w-full rounded-xl border border-border/80 bg-background/60 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* INCLUDED EXPECTATIONS (SELECTED TIER) */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      INCLUDED EXPECTATIONS ({currentTierInfo.tag} TIER)
                    </label>

                    <div className="rounded-xl border border-border/70 bg-background/50 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          Scope Deliverables:
                        </span>
                        <span className="font-mono text-[10px] text-steel bg-steel/10 border border-steel/30 px-2 py-0.5 rounded-full font-medium">
                          {currentTierInfo.badge}
                        </span>
                      </div>

                      <ul className="space-y-2 text-xs font-mono text-muted-foreground">
                        {currentTierInfo.deliverables.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-steel font-bold shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* PROJECT BRIEF */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        PROJECT / BUSINESS BRIEF *
                      </label>
                      <span className="font-mono text-[10px] text-steel">
                        {projectDescription.length} characters
                      </span>
                    </div>

                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                      <textarea
                        required
                        rows={4}
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Detail your requirements, endpoints, UI styling guides, integrations, expected user volume, or deployment timelines. Be as specific as you like."
                        className="w-full rounded-xl border border-border/80 bg-background/60 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-steel/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  {briefErrorMsg && (
                    <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2 font-mono">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>{briefErrorMsg}</span>
                    </div>
                  )}

                  <TurnstileWidget
                    onVerify={(token) => setBriefTurnstileToken(token)}
                    onExpire={() => setBriefTurnstileToken("")}
                  />

                  <p className="text-[10px] text-muted-foreground leading-tight text-center font-mono">
                    By submitting, you agree to our{" "}
                    <Link to="/privacy-policy" className="underline hover:text-foreground">
                      Privacy Policy
                    </Link>
                    ,{" "}
                    <Link to="/cookie-policy" className="underline hover:text-foreground">
                      Cookie Policy
                    </Link>{" "}
                    &amp;{" "}
                    <Link to="/terms" className="underline hover:text-foreground">
                      Terms
                    </Link>
                    .
                  </p>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmittingBrief || !briefTurnstileToken}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-background font-semibold transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
                  >
                    <span>
                      {isSubmittingBrief ? "Submitting Brief..." : "Submit Inquiry Brief →"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
