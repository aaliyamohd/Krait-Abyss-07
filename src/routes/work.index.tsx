import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AIAgentPipelinePanel } from "@/components/site/AIAgentPipelinePanel";
import { showcaseService, type WorkShowcaseItem } from "@/services/showcaseService";
import { INITIAL_WORK_PROJECTS } from "@/data/work";
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Zap,
  ExternalLink,
  Globe,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Verified Work & Process — Krait Abyss" },
      {
        name: "description",
        content:
          "Explore real-world production systems and client projects engineered by Krait Abyss. Full proof of practical hands-on execution.",
      },
      { property: "og:title", content: "Verified Work & Process — Krait Abyss" },
      {
        property: "og:description",
        content: "Real client projects, enterprise architectures, and milestone delivery process.",
      },
    ],
  }),
  component: WorkIndex,
});

const phases = [
  {
    k: "01",
    t: "Discovery",
    d: "Brief, constraints, users and success metrics. Fixed scope written down before anything is built.",
  },
  {
    k: "02",
    t: "Architecture",
    d: "Data model, routes, integrations and infrastructure mapped — including what stays manual.",
  },
  {
    k: "03",
    t: "Design",
    d: "Wireframes to a token-driven design system, so every screen stays consistent as the product grows.",
  },
  {
    k: "04",
    t: "Build",
    d: "Typed front end, server functions, database with row-level security, and automated workflows.",
  },
  {
    k: "05",
    t: "Deploy",
    d: "Domain, SSL, environments, CI/CD and backups configured for production from day one.",
  },
  {
    k: "06",
    t: "Operate",
    d: "Content editable by your admins after launch, plus a maintenance track for fixes and upgrades.",
  },
];

const stack = [
  "TypeScript",
  "React",
  "TanStack Start",
  "Tailwind CSS",
  "Postgres RLS",
  "Zero-Trust Auth / 2FA",
  "n8n Pipelines",
  "Docker",
  "CI/CD",
  "WebGPU",
];

function WorkIndex() {
  const navigate = useNavigate();
  const [showcaseItems, setShowcaseItems] = useState<WorkShowcaseItem[]>([]);

  useEffect(() => {
    const dynamicItems = showcaseService.getShowcaseItems();
    if (dynamicItems.length > 0) {
      setShowcaseItems(dynamicItems);
    } else {
      setShowcaseItems(INITIAL_WORK_PROJECTS as WorkShowcaseItem[]);
    }

    const handleStorageChange = () => {
      const updated = showcaseService.getShowcaseItems();
      setShowcaseItems(
        updated.length > 0 ? updated : (INITIAL_WORK_PROJECTS as WorkShowcaseItem[]),
      );
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div>
      {/* Scroll Down Prompt Indicator Banner */}
      <div className="border-b border-steel/30 bg-steel/10 py-3 text-center backdrop-blur-md">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-steel hover:text-foreground transition-colors"
        >
          <Zap className="h-4 w-4 animate-bounce text-steel" />
          <span>Scroll down to see our live projects &amp; work ↓</span>
        </a>
      </div>

      {/* ── WORK HERO SECTION WITH EMBEDDED WORKFLOW PANEL ────────── */}
      <section className="relative overflow-hidden border-b border-border/80">
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-12 md:py-24 items-center">
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-steel shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Client Proof</span>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-steel">Real systems, proven delivery</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Explore live client projects and enterprise architectures built for real-world
              production environments.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.02] shadow-lg font-bold"
              >
                <span>START DISCOVERY</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-md border border-steel/40 bg-steel/10 px-5 py-3 font-mono text-xs uppercase tracking-widest text-steel font-bold hover:bg-steel/20 hover:border-steel transition-all shadow-md"
              >
                <span>SCROLL DOWN TO SEE OUR LIVE PROJECTS ↓</span>
              </a>
            </div>
          </div>

          {/* AI Agent System Architecture Visual Panel */}
          <div className="relative flex flex-col items-center justify-center w-full lg:col-span-8 overflow-visible">
            <AIAgentPipelinePanel className="w-full" />
          </div>
        </div>

        {/* ── TRUST & SLA STATISTICS STRIP FOR CLIENT CONVERSION ───── */}
        <div className="border-t border-border/70 bg-card/40 py-6 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="font-mono text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">100%</div>
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Verified On-Time Delivery</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-2xl md:text-3xl font-extrabold text-steel tracking-tight">&lt; 2 Hours</div>
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Record Fulfillment SLA</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-2xl md:text-3xl font-extrabold text-steel tracking-tight">AES-256</div>
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Zero-Trust Encrypted Intake</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">99.99%</div>
              <div className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Production Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC REAL CLIENT PROJECTS SHOWCASE (FIRST PROJECT LEFT CORNER) ───── */}
      {showcaseItems.length > 0 && (
        <section id="projects" className="relative border-b border-border/80 bg-background/60 py-24 overflow-hidden">
          {/* Subtle Ambient Background Lighting Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-steel/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-5">
            {/* Section Subheading & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-steel shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-steel" />
                  <span>CLIENT SHOWCASE &amp; DELIVERED WORK</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  Recent Client Engagements &amp; <span className="text-steel">Production Builds</span>
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
                  Real-world web platforms, document fulfillment engines, and enterprise software engineered for production traffic. Updated live after every deployment.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="inline-flex items-center gap-2 rounded-xl border border-steel/30 bg-steel/10 px-4 py-2 font-mono text-xs font-semibold text-steel shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-steel opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-steel"></span>
                  </span>
                  <span>{showcaseItems.length} LIVE PRODUCTION BUILDS</span>
                </div>
              </div>
            </div>

            {/* Showcase Grid (Positioned in Top-Left Corner with 1:1 Aspect Ratio Square & 100% Visible Button) */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto my-6">
              {showcaseItems.map((item) => {
                const liveUrl = item.liveUrl ? item.liveUrl.trim() : "";
                const hasLiveWebsite = Boolean(liveUrl && liveUrl !== "N/A" && liveUrl !== "none" && liveUrl !== "undefined");

                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      navigate({
                        to: "/work/$projectId",
                        params: { projectId: item.id },
                      })
                    }
                    className="group relative flex flex-col justify-between rounded-3xl border border-steel/40 bg-[#0d0f14]/95 p-6 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-steel/80 hover:shadow-[0_0_50px_rgba(255,255,255,0.22)] hover:-translate-y-1 cursor-pointer text-left w-full min-h-[420px] space-y-4"
                  >
                    {/* Image Preview */}
                    {item.imageUrl && (
                      <div className="relative overflow-hidden rounded-2xl border border-steel/20 bg-abyss h-44 w-full group-hover:border-steel/50 transition-colors shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Website Name & Brief Details */}
                    <div className="space-y-2 flex-1 flex flex-col justify-start">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-steel transition-colors leading-snug">
                          {item.title || item.clientName}
                        </h3>
                        {!hasLiveWebsite && (
                          <span className="rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 font-mono text-[9px] font-bold shrink-0">
                            CONFIDENTIAL
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 font-sans">
                        {item.description}
                      </p>
                    </div>

                    {/* DYNAMIC BUTTONS: DUAL ACTIONS WHEN LIVE URL PROVIDED, SINGLE WHEN CONFIDENTIAL */}
                    <div className="pt-3 border-t border-steel/30 shrink-0 space-y-2">
                      {hasLiveWebsite ? (
                        <>
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-steel text-black px-4 py-3 font-mono text-xs font-black uppercase tracking-widest transition-all hover:bg-white hover:text-black hover:scale-[1.02] shadow-[0_0_25px_rgba(255,255,255,0.3)] border border-steel/80 cursor-pointer"
                          >
                            <Globe className="h-4 w-4 shrink-0 text-black" />
                            <span>VIEW THE WEBSITE</span>
                            <ExternalLink className="h-4 w-4 shrink-0 text-black" />
                          </a>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({
                                to: "/work/$projectId",
                                params: { projectId: item.id },
                              });
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-background/80 border border-steel/50 text-steel px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:bg-steel/20 hover:text-white hover:border-steel cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5 shrink-0 text-steel" />
                            <span>KNOW ABOUT THE PROJECT</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({
                              to: "/work/$projectId",
                              params: { projectId: item.id },
                            });
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-steel/20 border border-steel/60 text-steel px-4 py-3 font-mono text-xs font-black uppercase tracking-widest transition-all hover:bg-steel hover:text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          <span>KNOW ABOUT THE PROJECT</span>
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── CLIENT ATTRACTION & CONVERSION LEAD BANNER ──────────────── */}
            <div className="mt-16 sm:mt-24 mx-auto max-w-5xl rounded-3xl border border-steel/30 bg-card/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-steel/10 blur-[90px] pointer-events-none rounded-full" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] text-steel font-bold uppercase tracking-widest">
                    <Zap className="h-4 w-4 text-steel animate-bounce" />
                    <span>ENGINEER YOUR SYSTEM LIKE RECORD WRITERS</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    Ready to Automate Your Document Intake &amp; Order Fulfillment?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Get an enterprise-grade web platform, automated document intake pipeline, and 24/7 client notification engine tailored for your exact operational requirements.
                  </p>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto shrink-0">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-background transition-all hover:scale-105 shadow-lg"
                  >
                    <span>Request Custom System</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/book-call"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-steel/40 bg-steel/10 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-steel hover:bg-steel/20 transition-all shadow-md"
                  >
                    <span>Book Discovery</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SIX PHASES GRID ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">METHODOLOGY</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Six phases of execution
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {phases.map((p) => (
            <div
              key={p.k}
              className="surface-panel group rounded-xl p-6 transition-transform hover:-translate-y-1"
            >
              <span className="font-mono text-xs text-steel font-semibold">{p.k}</span>
              <h3 className="mt-3 text-lg font-medium">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>

        {/* Stack Tags */}
        <div className="mt-16">
          <p className="eyebrow">ENGINEERING STACK</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border bg-panel px-3.5 py-2 font-mono text-[0.7rem] tracking-wider text-steel"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Status Terminal Code Box */}
        <div className="code-box mt-14 max-w-xl p-5 bg-abyss">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-steel">$</span> GET /status --env production
          </p>
          <p className="mt-2 font-mono text-xs text-steel">
            {'{ "build": "passing", "uptime": "99.98%", "pipeline": "active" }'}
          </p>
          <p className="mt-1 font-mono text-xs text-foreground">
            ✔ discovery · ✔ architecture · ✔ delivery verified
          </p>
        </div>

        <Link
          to="/contact"
          className="mt-10 inline-block rounded-md bg-foreground px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90"
        >
          Start the discovery call
        </Link>
      </section>
    </div>
  );
}
