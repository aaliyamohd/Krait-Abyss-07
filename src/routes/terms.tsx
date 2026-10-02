import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, ShieldCheck, Scale, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Krait Abyss" },
      {
        name: "description",
        content:
          "Terms of Service for Krait Abyss. Guidelines and legal terms governing studio website usage and software development inquiries.",
      },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
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
            <Scale className="h-3.5 w-3.5" />
            <span>TERMS OF SERVICE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: {lastUpdated} | Studio Architecture Version: 2.4.0
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">01.</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p>
              By accessing or using the Krait Abyss website (`kraitabyss.com`), submitting project briefs, or scheduling engineering consultations, you agree to comply with these Terms of Service. If you do not agree, please do not access or use our portal.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">02.</span>
              <span>Services &amp; Informational Disclaimer</span>
            </h2>
            <p>
              Krait Abyss is a software development and technology studio specializing in custom SaaS products, generative AI agent workflows, design systems, and business automation. Content on this website is for general informational purposes and does not by itself constitute a binding software agreement, project proposal, or guaranteed quote until a formal Master Services Agreement (MSA) or Statement of Work (SOW) is executed.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">03.</span>
              <span>Acceptable Use &amp; Security</span>
            </h2>
            <p>
              You agree not to misuse our website or submit malicious software, automated form spam, or fraudulent project briefs. We reserve the right to block access or IP addresses violating system security controls.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">04.</span>
              <span>Intellectual Property</span>
            </h2>
            <p>
              All trademarks, logos, design code, 3D visual assets, and content on this site are the property of Krait Abyss unless otherwise noted (such as client showcase trademarks like Record Writers Platform).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">05.</span>
              <span>Governing Law &amp; Contact</span>
            </h2>
            <p>
              These Terms shall be governed by applicable laws. For questions regarding these Terms or studio operations, contact us at <a href="mailto:kraitabyss07@gmail.com" className="text-steel underline">kraitabyss07@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
