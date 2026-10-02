import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Krait Abyss" },
      {
        name: "description",
        content:
          "Privacy Policy for Krait Abyss. Learn how we collect, process, and protect your data across our software studio platform.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

export function PrivacyPolicyPage() {
  const lastUpdated = "2026-09-30";

  return (
    <div className="py-12 md:py-20 text-foreground">
      <div className="mx-auto max-w-4xl px-5 space-y-10">
        {/* Navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="border-b border-border/80 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-steel">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>TRANSPARENT DATA POLICY</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: {lastUpdated} | Studio Architecture Version: 2.4.0
          </p>
        </div>

        {/* Notice Banner */}
        <div className="rounded-2xl border border-steel/30 bg-card/60 p-5 backdrop-blur-xl text-xs leading-relaxed text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-steel" />
            <span>Privacy Foundation &amp; Commitment</span>
          </p>
          <p>
            This Privacy Policy describes how Krait Abyss (&quot;we&quot;, &quot;our&quot;, or &quot;the Studio&quot;) handles information submitted by visitors, software clients, and job applicants across our website, contact forms, and client portal. We operate as a technology studio providing custom software development, AI systems engineering, and business automation.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">01.</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              We only collect personal information that you voluntarily provide to us when contacting our studio or applying for employment:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Contact &amp; Discovery Inquiries:</strong> Full name, email address, phone number, and scheduled appointment dates.</li>
              <li><strong>Project Specifications:</strong> Business/company name, service type selected, project description, target budget, timeline, product links, and reference links.</li>
              <li><strong>Career Applications:</strong> Full name, email address, phone number, city/country location, role applied for, LinkedIn profile URL, portfolio URL, years of experience, technology skills, motivation note, and uploaded resume/CV file (PDF/DOC/DOCX).</li>
              <li><strong>Technical Logs:</strong> Server logs capture IP address, browser type, timestamps, and Cloudflare Turnstile security verification tokens to protect against automated spam and unauthorized access.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">02.</span>
              <span>Strict Data Accuracy &amp; Zero-Fabrication Rule</span>
            </h2>
            <p>
              Our systems process <strong>ONLY</strong> the exact data you enter into our forms. We do not synthesize, invent, or substitute fake company names, default budgets, or fictional project tiers for unentered optional fields. If an optional field is left blank, it is stored and transmitted as unprovided.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">03.</span>
              <span>Purpose of Data Processing</span>
            </h2>
            <p>
              Your data is processed exclusively for the following operational purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>To evaluate software project briefs and prepare architectural consultations.</li>
              <li>To schedule discovery calls and communicate regarding engineering inquiries.</li>
              <li>To evaluate job applicants for open career positions.</li>
              <li>To maintain website security, prevent brute-force attacks, and audit system health.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">04.</span>
              <span>Third-Party Infrastructure &amp; Processing Services</span>
            </h2>
            <p>
              To operate our platform securely, we utilize select enterprise service providers who process data strictly on our behalf:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Resend API (api.resend.com):</strong> Encrypted transactional email dispatch to studio lead engineers.</li>
              <li><strong>Supabase (supabase.co):</strong> Encrypted database storage with Row-Level Security (RLS).</li>
              <li><strong>Cloudflare Turnstile:</strong> Bot protection and security challenge verification.</li>
            </ul>
            <p className="text-xs italic">
              We do NOT sell, rent, or trade client or applicant personal information to third-party advertisers or data brokers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">05.</span>
              <span>Data Retention &amp; Security</span>
            </h2>
            <p>
              Project briefs and recruitment records are retained only for as long as necessary to fulfill client projects or evaluate employment candidacies. Uploaded resumes are stored in a protected backend directory with restricted file permissions.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">06.</span>
              <span>User &amp; Data Principal Rights</span>
            </h2>
            <p>
              Depending on your jurisdiction (including India&apos;s Digital Personal Data Protection Act, 2023), you may request access to, correction of, or deletion of your personal data by contacting us directly at <a href="mailto:kraitabyss07@gmail.com" className="text-steel underline">kraitabyss07@gmail.com</a>.
            </p>
          </section>

          {/* Legal Review Notice */}
          <div className="rounded-xl border border-steel/20 bg-abyss p-4 text-xs font-mono text-steel/80 space-y-1">
            <p className="font-bold">LEGAL REVIEW NOTICE:</p>
            <p>
              This document serves as our operational data practices foundation. Business owner should confirm formal legal entity name, corporate address, and jurisdiction details prior to production deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
