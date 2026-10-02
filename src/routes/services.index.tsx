import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { services } from "@/data/services";
import { FAQSection } from "@/components/site/FAQSection";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Krait Abyss Technology Studio" },
      {
        name: "description",
        content:
          "AI/ML Solutions, AI Custom Solutions, Website & Digital, Software & SaaS, Design & Creative, and Business & Operations.",
      },
      { property: "og:title", content: "Services — Krait Abyss" },
      {
        property: "og:description",
        content: "Explore Krait Abyss service capabilities for startups and enterprise clients.",
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">Full Capability Map</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          <span className="text-steel">Services &amp; Solutions</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          From AI agents and automated workflows to custom SaaS platforms, digital experiences, and
          creative technology.
        </p>

        {/* Startup to Enterprise Banner Message */}
        <div className="mt-8 rounded-2xl border border-steel/30 bg-card/80 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-steel font-mono text-xs mb-2">
            <Sparkles className="h-4 w-4" /> ADAPTABLE ENGAGEMENT SCOPES
          </div>
          <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
            "Whether you're a startup with a small idea or an established company solving a complex
            problem — we're ready to build with you."
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Small Projects · Startup MVPs · Growing Business Automation · Enterprise Systems
          </p>
        </div>

        {/* ── 6 CORE SERVICE CARDS GRID ── */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.index}
              onClick={() => navigate({ to: "/services/$slug", params: { slug: s.slug } })}
              className="surface-panel group relative flex flex-col justify-between rounded-2xl p-6 md:p-7 border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-steel/60 hover:shadow-[0_0_25px_rgba(255,255,255,0.04)] cursor-pointer"
            >
              <div>
                {/* Header: Index */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-steel font-bold tracking-widest">
                    {s.index}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground group-hover:text-steel transition-colors">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>

                {/* Sub-services / Preview Tags */}
                <div className="mt-5 pt-4 border-t border-border/40 space-y-2">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-steel block font-semibold">
                    INCLUDED CAPABILITIES
                  </span>
                  <p className="font-mono text-[0.7rem] text-muted-foreground/90 leading-relaxed">
                    {s.previewTags}
                  </p>
                </div>
              </div>

              {/* Bottom Footer Action: CONTACT FOR COSTING */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: "/contact", search: { service: s.serviceContext } });
                  }}
                  className="w-full inline-flex items-center justify-center rounded-xl border border-white bg-white text-black py-2.5 px-4 font-mono text-[0.7rem] uppercase tracking-widest font-bold transition-all hover:bg-neutral-200 hover:border-neutral-200 shadow-md"
                >
                  CONTACT FOR COSTING
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-16">
          <FAQSection />
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate({ to: "/contact" })}
            className="inline-flex items-center gap-2 rounded-xl border border-white bg-white px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-black font-bold transition-opacity hover:opacity-90 shadow-lg"
          >
            <span>CONTACT FOR COSTING</span>
          </button>
        </div>
      </div>
    </div>
  );
}
