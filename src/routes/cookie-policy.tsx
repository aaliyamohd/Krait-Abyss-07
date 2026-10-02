import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cookie, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | Krait Abyss" },
      {
        name: "description",
        content:
          "Cookie Policy for Krait Abyss. Learn how cookies and local storage are utilized on our platform.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

export function CookiePolicyPage() {
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
            <Cookie className="h-3.5 w-3.5" />
            <span>COOKIE &amp; STORAGE TRANSPARENCY</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Cookie Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: {lastUpdated} | Studio Architecture Version: 2.4.0
          </p>
        </div>

        {/* Audit Summary Card */}
        <div className="rounded-2xl border border-steel/30 bg-card/60 p-5 backdrop-blur-xl text-xs leading-relaxed text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-steel" />
            <span>Actual Codebase Audit Verification</span>
          </p>
          <p>
            Krait Abyss strictly maintains a privacy-first web architecture. We <strong>DO NOT</strong> use third-party advertising trackers, Meta Pixel, Google Analytics, or invasive cross-site tracking cookies.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">01.</span>
              <span>Essential Session Storage &amp; Local Storage</span>
            </h2>
            <p>
              Instead of tracking cookies, our web application utilizes standard HTML5 Browser LocalStorage strictly for technical operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Authentication Sessions (`sb-*-auth-token`, `krait_demo_session`):</strong> Stores encrypted authentication tokens for logged-in studio users and administrators.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">02.</span>
              <span>Third-Party Technical Security Tokens</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Cloudflare Turnstile (`challenges.cloudflare.com`):</strong> Generates short-lived anti-bot tokens to protect contact forms from automated spam submissions.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-xs text-steel">03.</span>
              <span>Zero Non-Essential Tracking</span>
            </h2>
            <p>
              Because Krait Abyss uses zero non-essential advertising or analytics tracking cookies, no cookie consent banner or preference modal is displayed. Technical session data can be cleared at any time directly through your browser settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
