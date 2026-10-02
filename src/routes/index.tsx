import { createFileRoute, Link } from "@tanstack/react-router";
import { services } from "@/data/services";
import { FAQSection } from "@/components/site/FAQSection";
import { ReadyToBuildCTA } from "@/components/site/ReadyToBuildCTA";
import { HomepageIntroOverlay } from "@/components/site/HomepageIntroOverlay";
import { DetailedCodeBox } from "@/components/site/DetailedCodeBox";
import { ContactRobotVisual } from "@/components/site/ContactRobotVisual";
import { ContactNeuralOrb } from "@/components/ContactNeuralOrb";
import {
  Maximize2,
  Type,
  Pencil,
  MessageSquare,
  ChevronRight,
  Activity,
  Terminal,
  Cpu,
  ShieldCheck,
  Layers,
  Workflow,
  Sparkles,
  Code2,
  FileCode,
  Check,
  Copy,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Krait Abyss | AI, Automation, Software & Digital Solutions" },
      {
        name: "description",
        content:
          "Krait Abyss builds digital products and intelligent systems: web development, AI automation, AI agents, SaaS software, and digital solutions for startups and enterprises.",
      },
      {
        property: "og:title",
        content: "Krait Abyss | AI, Automation, Software & Digital Solutions",
      },
      {
        property: "og:description",
        content:
          "A technology studio building websites, AI agents, automation pipelines, SaaS platforms and digital products.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { k: "06", v: "Core service categories" },
  { k: "AI", v: "Agents & RAG systems" },
  { k: "24/7", v: "Automated workflows" },
  { k: "100%", v: "Custom built" },
];

function Home() {
  return (
    <div>
      <HomepageIntroOverlay />

      {/* ── HERO SECTION: 3D ROBOT VISUAL & COMPACT PROPORTIONED CODE CONSOLE ── */}
      <section className="relative overflow-hidden border-b border-border/80 py-8 md:py-12 lg:py-14">
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-start mb-8 -mt-2">
            {/* Left Column Text & Actions */}
            <div className="animate-rise z-10 space-y-3">
              <p className="eyebrow tracking-[0.22em] text-muted-foreground font-mono text-xs font-semibold">
                DIGITAL SYSTEMS · AI · AUTOMATION · DESIGN
              </p>
              <h1 className="text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="text-steel">Krait Abyss</span>
                <span className="mt-2 block text-xl font-normal text-muted-foreground md:text-2xl lg:text-3xl">
                  We build digital products and intelligent systems.
                </span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                A technology studio for businesses, creators and organizations — engineering websites,
                AI agents, automation pipelines, interfaces and scalable cloud infrastructure.
              </p>

              {/* SLIGHTLY SMALLER & PRECISE ACTION BUTTONS */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {/* 4 Action Buttons in Unified Design System */}
                <Link
                  to="/contact"
                  className="group relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-5 font-mono text-xs font-bold uppercase tracking-wider text-background transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.22)] shadow-xl"
                >
                  <span>START A PROJECT</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/work"
                  className="group relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-5 font-mono text-xs font-bold uppercase tracking-wider text-background transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.22)] shadow-xl"
                >
                  <span>SEE OUR WORK</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/services"
                  className="group relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-5 font-mono text-xs font-bold uppercase tracking-wider text-background transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.22)] shadow-xl"
                >
                  <span>EXPLORE SERVICES</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/careers"
                  className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl border border-steel/40 bg-card/90 px-5 font-mono text-xs font-bold uppercase tracking-wider text-steel backdrop-blur-xl transition-all hover:bg-steel/20 hover:border-steel hover:text-foreground hover:scale-[1.02] shadow-lg"
                >
                  <span>WORK WITH US</span>
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Robot Pulled Up Slightly */}
            <div className="relative flex flex-col items-center justify-start z-10 w-full max-w-xl lg:max-w-2xl mx-auto -mt-4 sm:-mt-8">
              <ContactRobotVisual className="w-full" variant="homepage" />
            </div>
          </div>

          {/* SLEEK & BROAD RECTANGULAR CODE CONSOLE (LANDSCAPE SLEEPING FORMAT) */}
          <div className="w-full max-w-6xl mx-auto pt-4">
            <div className="flex items-center justify-between mb-2 font-mono text-xs text-steel">
              <span className="flex items-center gap-2 uppercase tracking-wider font-semibold">
                <Terminal className="h-4 w-4 text-steel" />
                <span>VS CODE EXECUTION ENGINE</span>
              </span>
              <span className="text-[10px] text-muted-foreground border border-steel/20 bg-steel/10 px-2.5 py-0.5 rounded-full uppercase">
                REALTIME CODE SWITCHER &amp; TERMINAL
              </span>
            </div>
            <DetailedCodeBox className="w-full shadow-2xl" />
          </div>
        </div>
      </section>

      {/* ── MASTER CONTENT BOX 2: SYSTEM CAPABILITIES CONSOLE ──────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-black/90 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow text-steel tracking-[0.2em] font-mono text-xs font-semibold uppercase">
                FULL CAPABILITY ENGINE
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                What We Build &amp; System Architecture
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-steel flex items-center gap-2 border border-steel/30 bg-steel/10 px-3 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-steel animate-pulse" />
              6 CORE SYSTEMS ACTIVE
            </span>
          </div>

          {/* MASTER CONTENT BOX #2: Wide Rectangular Showcase Panel */}
          <div className="surface-panel relative w-full overflow-hidden rounded-2xl border border-border/80 bg-[#090b10]/95 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-4 mb-6">
              <span className="font-mono text-xs text-steel font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-steel" />
                <span>krait-solutions-architecture.map</span>
              </span>
              <span className="font-mono text-[0.65rem] text-muted-foreground uppercase border border-border/60 px-2.5 py-1 rounded bg-card">
                ENTERPRISE &amp; STARTUP ECOSYSTEM
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Autonomous AI Agent Swarm",
                  type: "AI / AGENTIC SYSTEM",
                  desc: "Multi-agent research and lead-gen workflow with memory vectors.",
                },
                {
                  title: "n8n Automation Pipeline",
                  type: "BUSINESS AUTOMATION",
                  desc: "Form-to-CRM automation with email parsing and WhatsApp DB sync.",
                },
                {
                  title: "RAG Support Assistant",
                  type: "AI CHATBOT",
                  desc: "Context-aware knowledge base assistant trained on custom docs.",
                },
                {
                  title: "SaaS Admin & Analytics Dashboard",
                  type: "SOFTWARE & SAAS",
                  desc: "High-density dark operational dashboard with real-time telemetry.",
                },
                {
                  title: "Full-Stack Web Application",
                  type: "WEBSITE & DIGITAL",
                  desc: "Product marketing platform engineered with fast SSR and edge caching.",
                },
                {
                  title: "Creative & Editing Pipeline",
                  type: "DIGITAL MEDIA",
                  desc: "Automated video asset assembly and motion graphic rendering.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 flex flex-col justify-between hover:border-steel/50 transition-colors"
                >
                  <div>
                    <span className="font-mono text-[0.6rem] text-steel font-semibold uppercase tracking-wider block mb-1">
                      {item.type}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground tracking-tight">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWN BELOW SECTION: 3 SMALL CODE BOXES & 3D NEURAL NETWORK WITH LINES ── */}
      <section className="relative overflow-hidden border-b border-border bg-black/95 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10">
            <p className="eyebrow text-steel tracking-[0.2em] font-mono text-xs font-semibold uppercase">
              INTERACTIVE RUNTIMES &amp; 3D NEURAL CORE
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Live Modules &amp; 3D Neural Network
            </h2>
            <p className="mt-2 text-xs font-mono text-muted-foreground">
              Micro-services, streaming pipelines, and 3D neural synapse lattice running inside Krait Abyss.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Left: 3 Small Code Boxes */}
            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-1">
              {/* Small Code Box 1 */}
              <div className="surface-panel rounded-xl border border-border/70 bg-[#080a0f]/90 p-4 font-mono text-xs shadow-lg">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-steel animate-pulse" />
                    <span className="text-steel font-semibold text-[11px]">agent-swarm.ts</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground border border-border/40 px-2 py-0.5 rounded bg-card font-mono">
                    AI AGENT
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed font-mono">
                  <p className="text-slate-500">// Dispatch Multi-Agent Task Swarm</p>
                  <p>
                    <span className="text-steel font-semibold">const</span> <span className="text-slate-200">swarm</span> = <span className="text-steel font-semibold">new</span> <span className="text-foreground font-semibold">AgentCluster</span>(&#123; <span className="text-slate-400">maxAgents</span>: <span className="text-steel">8</span> &#125;);
                  </p>
                  <p>
                    <span className="text-steel font-semibold">await</span> <span className="text-slate-200">swarm</span>.<span className="text-foreground font-semibold">dispatch</span>(&#123; <span className="text-slate-400">mode</span>: <span className="text-slate-200">"autonomous"</span> &#125;);
                  </p>
                </div>
              </div>

              {/* Small Code Box 2 */}
              <div className="surface-panel rounded-xl border border-border/70 bg-[#080a0f]/90 p-4 font-mono text-xs shadow-lg">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-steel animate-pulse" />
                    <span className="text-steel font-semibold text-[11px]">n8n-pipeline.json</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground border border-border/40 px-2 py-0.5 rounded bg-card font-mono">
                    AUTOMATION
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed font-mono">
                  <p className="text-slate-500">// n8n Webhook CRM Sync Payload</p>
                  <p>&#123; <span className="text-steel">"trigger"</span>: <span className="text-slate-200">"form_submit"</span>, <span className="text-steel">"target"</span>: <span className="text-slate-200">"HubSpot-DB"</span> &#125;</p>
                  <p>&#123; <span className="text-steel">"status"</span>: <span className="text-slate-200">"SYNCED"</span>, <span className="text-steel">"latencyMs"</span>: <span className="text-slate-200">18</span> &#125;</p>
                </div>
              </div>

              {/* Small Code Box 3 */}
              <div className="surface-panel rounded-xl border border-border/70 bg-[#080a0f]/90 p-4 font-mono text-xs shadow-lg">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-steel animate-pulse" />
                    <span className="text-steel font-semibold text-[11px]">rag-vector-query.py</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground border border-border/40 px-2 py-0.5 rounded bg-card font-mono">
                    RAG VECTOR
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed font-mono">
                  <p className="text-slate-500"># Query vector embeddings index</p>
                  <p>
                    <span className="text-steel font-semibold">results</span> = <span className="text-slate-200">vector_db</span>.<span className="text-foreground font-semibold">search</span>(query=<span className="text-slate-300">"system specs"</span>, top_k=<span className="text-steel">5</span>)
                  </p>
                </div>
              </div>
            </div>

            {/* Right: 3D Neural Network Sphere (with lines) Card */}
            <div className="lg:col-span-5 flex flex-col justify-stretch">
              <div className="surface-panel relative w-full h-full min-h-[380px] overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between p-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5 z-20 select-none">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-steel animate-pulse" />
                    <span className="font-mono text-[0.65rem] tracking-[0.2em] text-steel font-semibold uppercase">
                      3D NEURAL NETWORK CORE
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-steel">
                    <Sparkles className="h-3 w-3 text-steel animate-spin-slow" />
                    <span className="font-semibold tracking-wider uppercase">SYNAPSE LINES</span>
                  </div>
                </div>

                {/* 3D Neural Network Canvas Stage */}
                <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-1 min-h-[300px]">
                  <ContactNeuralOrb className="w-full h-full min-h-[300px]" />
                </div>

                <div className="border-t border-border/60 pt-2 flex items-center justify-between font-mono text-[0.6rem] text-muted-foreground z-20 select-none">
                  <span className="text-steel tracking-wider uppercase flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-steel" /> INERTIAL ROTATION
                  </span>
                  <span className="flex items-center gap-1.5 text-steel font-semibold uppercase tracking-wider">
                    <Activity className="h-3 w-3" /> ACTIVE · 60 FPS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STARTUP TO ENTERPRISE TRUST MESSAGE BANNER ─────────────── */}
      <section className="border-b border-border bg-black/90 py-12">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-steel/30 bg-steel/10 px-4 py-1.5 text-xs font-mono text-steel mb-4">
            <Sparkles className="h-3.5 w-3.5" /> ADAPTABLE ENGAGEMENT SCOPES
          </div>
          <blockquote className="text-lg md:text-xl font-medium tracking-tight text-foreground max-w-3xl mx-auto leading-relaxed">
            "Whether you're a startup with a small idea or an established company solving a complex
            problem — we're ready to build with you."
          </blockquote>
          <p className="mt-3 text-xs text-muted-foreground">
            Small projects · Startup MVPs · Growing business automations · Enterprise systems
          </p>
        </div>
      </section>

      {/* ── STATS SECTION ───────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.k} className="px-6 py-8">
              <p className="text-3xl font-semibold text-steel">{s.k}</p>
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS SECTION ──────────────────── */}
      <FAQSection />

      {/* ── READY TO BUILD CTA SECTION ──────────────────────────── */}
      <ReadyToBuildCTA />
    </div>
  );
}
