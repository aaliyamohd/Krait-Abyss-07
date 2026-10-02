import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, services } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found — Krait Abyss" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} — Krait Abyss`;
    return {
      meta: [
        { title },
        { name: "description", content: service.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: service.summary },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const idx = services.findIndex((s) => s.slug === service.slug);
  const next = services[(idx + 1) % services.length]!;

  return (
    <article className="relative min-h-screen overflow-hidden">

      <div className="relative z-10">
        <section className="relative overflow-hidden border-b border-border">
          <div className="grid-abyss pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-6xl px-5 py-20">
            <Link
              to="/services"
              className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              ← All services
            </Link>
            <p className="eyebrow mt-8">Service {service.index}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              <span className="text-steel">{service.title}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{service.tagline}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Overview</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{service.summary}</p>
            <div className="code-box mt-8 p-5">
              <p>
                <span className="text-accent">scope</span> = {"{"}
              </p>
              <p className="pl-4">service: "{service.index}",</p>
              <p className="pl-4">offerings: {service.items.length},</p>
              <p className="pl-4">delivery: "fixed scope · milestone based"</p>
              <p>{"}"}</p>
            </div>
            <Link
              to="/contact"
              search={{ service: service.serviceContext }}
              className="mt-8 inline-block rounded-xl border border-white bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-black font-bold hover:opacity-90 transition-opacity shadow-md"
            >
              CONTACT FOR COSTING
            </Link>
          </div>

          <div>
            <p className="eyebrow">What's included</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="surface-panel flex items-start gap-3 rounded-lg px-4 py-3 text-sm backdrop-blur-xl"
                >
                  <span className="mt-0.5 font-mono text-xs text-accent">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border">
          <Link
            to="/services/$slug"
            params={{ slug: next.slug }}
            className="mx-auto flex max-w-6xl items-center justify-between px-5 py-10 transition-colors hover:bg-panel/60"
          >
            <span>
              <span className="eyebrow">Next service</span>
              <span className="mt-2 block text-xl font-medium">{next.title}</span>
            </span>
            <span className="font-mono text-xs text-muted-foreground">→</span>
          </Link>
        </section>
      </div>
    </article>
  );
}
