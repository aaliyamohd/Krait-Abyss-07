import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { INITIAL_WORK_PROJECTS, WorkProject } from "@/data/work";
import { showcaseService, type WorkShowcaseItem } from "@/services/showcaseService";
import { services } from "@/data/services";
import { useState, useEffect } from "react";
import {
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Cpu,
  Workflow,
  Clock,
  Layers,
  Sparkles,
  Globe,
  FileCode,
  Server,
  ChevronRight,
  Database,
  Bot,
  ShieldCheck,
  Cloud,
  Terminal,
} from "lucide-react";

export const Route = createFileRoute("/work/$projectId")({
  loader: ({ params }) => {
    const projectId = params.projectId;
    const allItems = showcaseService.getShowcaseItems();
    const found = allItems.find(
      (item) =>
        item.id === projectId ||
        item.id.toLowerCase().includes(projectId.toLowerCase()) ||
        item.clientName.toLowerCase().replace(/\s+/g, "-") === projectId.toLowerCase() ||
        (projectId === "record-writers" && item.clientName.toLowerCase().includes("record")),
    );
    const fallback = INITIAL_WORK_PROJECTS.find(
      (p) => p.id === projectId || p.id.includes(projectId),
    ) || INITIAL_WORK_PROJECTS[0];

    return { project: found || fallback };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${(loaderData as any)?.project?.title || "Record Writers Platform"} | Krait Abyss`,
      },
      {
        name: "description",
        content:
          (loaderData as any)?.project?.description ||
          "Detailed case study, service capabilities, architecture breakdown, and live deployment details.",
      },
    ],
  }),
  component: ProjectDetailPage,
});

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/work/$projectId" });
  const loaderData = Route.useLoaderData();
  const [project, setProject] = useState<WorkShowcaseItem | WorkProject | null>(
    () => (loaderData as any)?.project || null,
  );

  useEffect(() => {
    const allItems = showcaseService.getShowcaseItems();
    const found = allItems.find(
      (item) =>
        item.id === projectId ||
        item.id.toLowerCase().includes(projectId.toLowerCase()) ||
        item.clientName.toLowerCase().replace(/\s+/g, "-") === projectId.toLowerCase() ||
        (projectId === "record-writers" && item.clientName.toLowerCase().includes("record")),
    );

    if (found) {
      setProject(found);
    } else {
      const fallback = INITIAL_WORK_PROJECTS.find(
        (p) => p.id === projectId || p.id.includes(projectId),
      ) || INITIAL_WORK_PROJECTS[0];
      setProject(fallback as WorkShowcaseItem);
    }
  }, [projectId]);

  if (!project) return null;

  const liveUrl = project.liveUrl ? project.liveUrl.trim() : "";
  const hasLiveWebsite = Boolean(liveUrl && liveUrl !== "N/A" && liveUrl !== "none" && liveUrl !== "undefined");

  const projectServices = services.filter((s) =>
    ["software-saas", "ai-custom-solutions", "website-app-development", "website-digital", "business-operations"].includes(
      s.slug,
    ),
  );

  return (
    <div className="relative overflow-hidden bg-transparent text-foreground py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-5 space-y-12">
        {/* Back Link Header */}
        <div>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 font-mono text-xs text-steel uppercase tracking-widest hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Work Showcase</span>
          </Link>
        </div>

        {/* HERO HEADER PANEL */}
        <div className="surface-panel rounded-3xl border border-steel/30 bg-card/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-steel/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-steel uppercase tracking-widest">
                {project.clientName}
              </span>
              <span className="rounded-full bg-steel/10 text-steel border border-steel/30 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest">
                Verified Production Build
              </span>
            </div>
            <span className="rounded-full bg-steel/10 px-3.5 py-1 font-mono text-xs font-medium text-steel border border-steel/20">
              {project.category}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {project.title}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              {project.fullDetails && (
                <p className="text-xs font-mono text-steel/90 bg-steel/10 p-3.5 rounded-xl border border-steel/20 leading-relaxed">
                  ⚡ {project.fullDetails}
                </p>
              )}

              {/* TOP ACTION BUTTONS */}
              <div className="pt-2 flex flex-wrap gap-3">
                {hasLiveWebsite ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-background font-bold transition-all hover:scale-105 shadow-xl group"
                  >
                    <Globe className="h-4 w-4" />
                    <span>VIEW THE WEBSITE</span>
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider">
                    <Lock className="h-4 w-4 text-rose-400" />
                    <span>CONFIDENTIAL CLIENT PROJECT (NDA ACTIVE)</span>
                  </div>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-steel/40 bg-steel/10 px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-steel hover:bg-steel/20 transition-all"
                >
                  <span>REQUEST SIMILAR SYSTEM</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Thumbnail Preview */}
            {project.imageUrl && (
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-2xl border border-steel/30 bg-abyss shadow-2xl group">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-md px-3 py-1 font-mono text-[10px] text-steel border border-steel/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-steel animate-pulse" />
                    <span>LIVE DEPLOYMENT ACTIVE</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* METRICS STRIP */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="surface-panel rounded-2xl border border-steel/30 bg-card/50 p-5 text-center backdrop-blur-xl shadow-lg space-y-1"
              >
                <div className="font-mono text-xl md:text-2xl font-bold text-steel">
                  {m.val || (m as any).value}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 1: PROBLEM / PURPOSE & WHAT WAS BUILT */}
        <div className="surface-panel rounded-3xl border border-steel/30 bg-card/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-steel mb-3">
              <Sparkles className="h-3.5 w-3.5 text-steel" />
              <span>PROJECT PURPOSE &amp; EXECUTION</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Problem &amp; System Purpose
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {project.problem || project.description}
            </p>
          </div>

          {project.whatWasBuilt && (
            <div className="rounded-2xl border border-steel/30 bg-card/80 p-6 space-y-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Workflow className="h-5 w-5 text-steel" />
                <span>What Was Built</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {project.whatWasBuilt}
              </p>
            </div>
          )}

          {/* KEY FEATURES GRID */}
          {((project.keyFeatures && project.keyFeatures.length > 0) || (project.highlights && project.highlights.length > 0)) && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-steel uppercase tracking-widest font-bold">
                KEY FEATURES &amp; CAPABILITIES:
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(project.keyFeatures || project.highlights || []).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-card/70">
                    <CheckCircle2 className="h-4 w-4 text-steel shrink-0 mt-0.5" />
                    <span className="text-xs text-foreground font-sans leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: DYNAMIC TECH STACK BREAKDOWN */}
        <div className="surface-panel rounded-3xl border border-steel/30 bg-card/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-steel mb-3">
              <Cpu className="h-3.5 w-3.5 text-steel" />
              <span>TECHNICAL ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Technology &amp; Stack Breakdown
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Comprehensive breakdown of front-end UI libraries, backend API microservices, database storage, automation tools, and cloud infrastructure.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. FRONTEND TECH */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-steel">
                <FileCode className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Frontend Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(project.frontendTech || ["React", "TypeScript", "Tailwind CSS"]).map((t) => (
                  <span key={t} className="rounded-md bg-steel/10 border border-steel/20 px-2.5 py-1 font-mono text-xs text-steel font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. BACKEND TECH */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-steel">
                <Server className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Backend Architecture</h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(project.backendTech || ["Express.js Node Engine", "n8n Workflows"]).map((t) => (
                  <span key={t} className="rounded-md bg-steel/10 border border-steel/20 px-2.5 py-1 font-mono text-xs text-steel font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. DATABASE */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-steel">
                <Database className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Database &amp; Storage</h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(project.databaseTech || ["PostgreSQL", "Supabase RLS"]).map((t) => (
                  <span key={t} className="rounded-md bg-steel/10 border border-steel/20 px-2.5 py-1 font-mono text-xs text-steel font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. APIS & INTEGRATIONS */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-steel">
                <Terminal className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">APIs &amp; Integrations</h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(project.apiIntegrations || ["Resend Email API", "WhatsApp Webhooks"]).map((t) => (
                  <span key={t} className="rounded-md bg-steel/10 border border-steel/20 px-2.5 py-1 font-mono text-xs text-steel font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. AUTOMATION & AI */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-steel">
                <Bot className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Automation &amp; AI</h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(project.aiAutomation || ["n8n Pipeline Engine", "Automated Dispatch"]).map((t) => (
                  <span key={t} className="rounded-md bg-steel/10 border border-steel/20 px-2.5 py-1 font-mono text-xs text-steel font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. DEPLOYMENT & PLATFORM */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-steel">
                <Cloud className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Deployment &amp; Platform</h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(project.deploymentPlatform || ["Netlify Edge CDN", "Global SSL"]).map((t) => (
                  <span key={t} className="rounded-md bg-steel/10 border border-steel/20 px-2.5 py-1 font-mono text-xs text-steel font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* OVERALL TECH STACK TAGS */}
          <div className="pt-4 border-t border-border/40 space-y-3">
            <h3 className="font-mono text-xs text-steel uppercase tracking-widest font-bold">
              COMPLETE TECH STACK SUMMARY:
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-steel/15 px-3 py-1.5 font-mono text-xs font-bold text-steel border border-steel/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: SERVICES EMPLOYED */}
        <div className="surface-panel rounded-3xl border border-steel/30 bg-card/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-steel mb-3">
              <Layers className="h-3.5 w-3.5 text-steel" />
              <span>SERVICES &amp; CAPABILITIES UTILIZED</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Services Employed In Building {project.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Explore the exact Krait Abyss service offerings integrated into this project. Click any service below to view full capabilities.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projectServices.map((s) => (
              <div
                key={s.slug}
                className="group flex flex-col justify-between rounded-2xl border border-steel/30 bg-[#0d0f14]/80 p-5 space-y-4 hover:border-steel/60 hover:shadow-lg transition-all"
              >
                <div className="space-y-2">
                  <span className="font-mono text-xs text-steel font-bold">{s.index}</span>
                  <h3 className="text-base font-bold text-foreground group-hover:text-steel transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {s.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/40 space-y-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-steel font-semibold block">
                    {s.previewTags}
                  </span>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-foreground hover:text-steel transition-colors"
                  >
                    <span>KNOW ABOUT SERVICE</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="surface-panel rounded-3xl border border-steel/30 bg-card/60 p-8 text-center backdrop-blur-2xl shadow-xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-3 py-0.5 font-mono text-[10px] font-bold text-steel uppercase tracking-widest">
              {project.title.toUpperCase()} LIVE PRODUCTION
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to Explore {project.title}?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Experience the live production system running in real-world deployment.
            </p>
          </div>

          {/* ACTION BUTTONS AT THE END */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {hasLiveWebsite ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-background font-bold transition-all hover:scale-105 shadow-xl group"
              >
                <Globe className="h-4 w-4" />
                <span>VIEW THE LIVE PROJECT</span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider">
                <Lock className="h-4 w-4 text-rose-400" />
                <span>CONFIDENTIAL CLIENT PROJECT</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING STICKY CORNER BUTTON IF LIVE URL */}
      {hasLiveWebsite && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-background shadow-[0_0_25px_rgba(255,255,255,0.25)] border border-steel/40 transition-all hover:scale-105 hover:bg-steel hover:text-background group"
        >
          <Globe className="h-3.5 w-3.5 text-steel animate-pulse group-hover:text-background" />
          <span>VIEW THE WEBSITE</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
