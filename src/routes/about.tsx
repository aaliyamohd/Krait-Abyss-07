import { createFileRoute } from "@tanstack/react-router";
import { team, teamCategories } from "@/data/team";
import { Panel, SectionHeader, BtnLink } from "@/components/site/ui";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Krait Abyss" },
      {
        name: "description",
        content:
          "About Krait Abyss: Our technical system workflow architecture, team growth story, and core engineering team.",
      },
      { property: "og:title", content: "About — Krait Abyss" },
      {
        property: "og:description",
        content:
          "Intelligent digital systems, continuous architecture workflow, and cross-functional engineering team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const workflowStages = [
  {
    step: "01",
    code: "RESEARCH",
    name: "Problem Research",
    desc: "Identify client operational challenges, market needs, and technical requirements.",
  },
  {
    step: "02",
    code: "DEFINE",
    name: "System Definition",
    desc: "Structure accessible digital solutions, architecture specifications, and project scope.",
  },
  {
    step: "03",
    code: "DEVELOPMENT",
    name: "Core Engineering",
    desc: "Build frontend UI components, backend APIs, and software testing frameworks.",
  },
  {
    step: "04",
    code: "PITCHING",
    name: "Client Alignment",
    desc: "Validate proposals, conduct lead research, and align technical briefs.",
  },
  {
    step: "05",
    code: "BUILD",
    name: "System Integration",
    desc: "Assemble UI/UX design, cloud backends, databases, and automated workflows.",
  },
  {
    step: "06",
    code: "TESTING",
    name: "Quality Assurance",
    desc: "Perform functional testing, bug detection, debugging, and UI assurance.",
  },
  {
    step: "07",
    code: "DEPLOYMENT",
    name: "Production Launch",
    desc: "Provision cloud infrastructure on AWS, SSL setup, and production deployment.",
  },
  {
    step: "08",
    code: "ITERATION",
    name: "Continuous Evolution",
    desc: "Monitor performance, gather feedback, and loop back to Research for optimization.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20 space-y-16">
      {/* 01 — INTRO / WHO WE ARE */}
      <section className="border-b border-border/60 pb-12">
        <p className="k-label">KRAIT_ABYSS / ABOUT</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl text-steel">
          ABOUT KRAIT ABYSS
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.24em] text-accent">
          Digital Systems · AI · Automation · Software · Design
        </p>

        <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
          Krait Abyss builds intelligent digital systems for businesses, startups, and ambitious
          ideas — from AI and automation to software, SaaS, and modern web experiences. We combine
          technical engineering with clean design to solve real operational and growth challenges.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="https://www.linkedin.com/in/krait-abyss-35b390432/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Krait Abyss LinkedIn Profile"
            className="inline-flex items-center gap-2.5 rounded-xl border border-border/80 bg-card/90 px-4 py-2.5 font-mono text-xs text-foreground font-semibold hover:border-accent hover:bg-accent/10 transition-all shadow-sm group"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#0A66C2] text-[0.65rem] font-bold text-white">
              in
            </span>
            <span>Connect with Krait Abyss on LinkedIn</span>
            <span className="text-accent font-mono text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              ↗
            </span>
          </a>
        </div>
      </section>

      {/* 02 — ONE SINGLE STORY BOX (WORKFLOW ARCHITECTURE + HOW THE TEAM GREW) */}
      <section id="story" className="scroll-mt-24">
        <Panel label="COMPANY_JOURNEY / SYSTEM_ARCHITECTURE" hover={false}>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
              CONTINUOUS ARCHITECTURE & JOURNEY
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              How We Work & Evolve
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Our engineering workflow operates as a continuous architecture loop from initial
              research through build, deployment, and ongoing iteration.
            </p>
          </div>

          {/* Workflow Architecture Loop Diagram */}
          <div className="mt-8 relative rounded-lg border border-border/80 bg-abyss/80 p-5 md:p-6 overflow-hidden">
            {/* Header bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3 mb-6 gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-foreground font-semibold">
                  WORKFLOW ARCHITECTURE
                </span>
              </div>
              <span className="font-mono text-[0.65rem] text-accent flex items-center gap-1.5 font-medium">
                <span>↻</span> RECURSIVE LOOP TO RESEARCH
              </span>
            </div>

            {/* Workflow Stages Grid */}
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {workflowStages.map((stg, idx) => (
                <div
                  key={stg.code}
                  className="relative rounded border border-border/70 bg-card/60 p-4 flex flex-col justify-between hover:border-steel/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[0.65rem] font-bold text-accent">
                        {stg.step}
                      </span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-steel">
                        {stg.code}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">{stg.name}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {stg.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-border/40 flex items-center justify-between font-mono text-[0.6rem] text-steel">
                    <span>{idx === workflowStages.length - 1 ? "LOOP BACK" : "NEXT"}</span>
                    <span className="text-accent font-bold">
                      {idx === workflowStages.length - 1 ? "↻ 01 RESEARCH" : "→"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Continuous Loop Architecture Connector */}
            <div className="mt-6 flex items-center justify-between rounded border border-accent/40 bg-accent/5 px-4 py-3 font-mono text-xs">
              <div className="flex items-center gap-2.5 text-accent">
                <span className="text-base font-bold">↻</span>
                <span className="text-[0.68rem] uppercase tracking-wider font-semibold">
                  ITERATION loops back to RESEARCH — continuous cycle of optimization & capability
                  expansion
                </span>
              </div>
              <span className="hidden sm:inline font-mono text-[0.6rem] text-muted-foreground">
                ARCHITECTURE_V2.0
              </span>
            </div>
          </div>

          {/* Under Workflow: HOW THE TEAM GREW */}
          <div className="mt-8 border-t border-border/60 pt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-accent">FOUNDATION</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                How the Team Grew
              </h3>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-muted-foreground max-w-3xl">
              Krait Abyss began with Mohd Aaliya Jabeen building practical digital projects. The
              initiative expanded into a shared team ambition when Mohd Saniya Begum and Shahistha
              Aliya Shaik joined for research and software testing. To support client pitching and
              cloud backend infrastructure, Mohammed Fardeen and Abdullah Mohammed Khan established
              market research, database handling, and AWS deployment pipelines. Keshav Loya and
              Mohammed Imran Khan completed the cross-functional studio by leading digital marketing
              and social media execution.
            </p>
          </div>
        </Panel>
      </section>

      {/* 03 — TEAM DIVISIONS SECTION */}
      <section id="team" className="scroll-mt-24 space-y-12">
        <SectionHeader
          eyebrow="KRAIT_ABYSS / TEAM_DIVISIONS"
          title="The Team & Operational Divisions"
          description="Seven specialists organized across three core functional divisions: Development, Research & Pitching, and Marketing & Social Media."
        />

        {teamCategories.map((cat) => {
          const membersInCat = team.filter((m) => m.category === cat.key);
          return (
            <div key={cat.key} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/70 pb-3 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
                    DIVISION {cat.index}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {cat.key}
                  </h3>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{cat.note}</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {membersInCat.map((m) => (
                  <Panel key={m.name} label={m.category.toUpperCase()} className="flex flex-col justify-between h-full">
                    <div className="flex-1 flex flex-col">
                      <h4 className="text-lg font-semibold tracking-tight text-foreground">
                        {m.name}
                      </h4>
                      <p className="mt-1 font-mono text-xs text-accent">{m.role}</p>

                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {m.summary}
                      </p>

                      <div className="mt-4 border-t border-border/50 pt-3 flex-1">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-foreground font-semibold mb-2">
                          RESPONSIBILITIES
                        </p>
                        <ul className="space-y-1">
                          {m.responsibilities.map((resp) => (
                            <li
                              key={resp}
                              className="font-mono text-[0.68rem] text-muted-foreground flex items-start gap-1.5"
                            >
                              <span className="text-accent">—</span> {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/40">
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on LinkedIn`}
                        className="group flex items-center justify-between rounded-xl border border-white bg-white text-black px-3.5 py-2 font-bold transition-all hover:bg-white/90 shadow-md cursor-pointer"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-black text-[0.6rem] font-mono text-white font-bold">
                            in
                          </span>
                          <span className="font-mono text-xs text-black font-bold truncate">
                            {m.linkedinId}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-black font-bold shrink-0 ml-2">
                          ↗
                        </span>
                      </a>
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 04 — FINAL CTA */}
      <section className="border-t border-border/60 bg-abyss/80 pt-12 pb-8">
        <div className="text-center">
          <p className="k-label">BUILD SOMETHING WITH US</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl text-steel">
            BUILD SOMETHING WITH US
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground max-w-xl mx-auto">
            Ready to turn your idea into a production digital system? Contact our team to discuss
            your project requirements and pricing options.
          </p>
          <div className="mt-8 flex justify-center">
            <BtnLink to="/contact" variant="primary">
              CONTACT FOR COSTING
            </BtnLink>
          </div>
        </div>
      </section>
    </div>
  );
}
