import { Link } from "@tanstack/react-router";
import logo from "@/assets/krait-logo.png";
import { site } from "@/data/site";
import { services } from "@/data/services";

const pages = [
  { to: "/about", label: "About" },
  { to: "/about", hash: "story", label: "Our Story" },
  { to: "/about", hash: "team", label: "Our Team" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

const legalPages = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/terms", label: "Terms of Service" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-abyss/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Krait Abyss logo"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-border/80 bg-black"
            />
            <div>
              <p className="font-mono text-sm tracking-[0.28em] text-steel">KRAIT ABYSS</p>
              <p className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground">
                DIGITAL SYSTEMS · AI · AUTOMATION · DESIGN
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            We build practical digital products and intelligent systems for businesses, creators and
            organizations.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              aria-label="Email Krait Abyss"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              @
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Krait Abyss on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              in
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Krait Abyss on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ig
            </a>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Chat with Krait Abyss on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              wa
            </a>
          </div>
        </div>

        <div>
          <p className="k-label">Services</p>
          <ul className="mt-4 space-y-2">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/services"
                className="font-mono text-xs uppercase tracking-[0.16em] text-accent"
              >
                All divisions →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="k-label">Studio</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {pages.map((p) => (
              <li key={p.to}>
                <Link
                  to={p.to}
                  hash={"hash" in p ? (p as any).hash : undefined}
                  className="transition-colors hover:text-foreground"
                >
                  {p.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 font-mono text-xs text-muted-foreground">{site.location}</li>
          </ul>
        </div>

        <div>
          <p className="k-label">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {legalPages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="transition-colors hover:text-foreground">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} KRAIT ABYSS 🐍 — BUILD THOUGHTFULLY · SOLVE PRACTICALLY ·
            HELP MEANINGFULLY
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              PRIVACY POLICY
            </Link>
            <Link to="/cookie-policy" className="hover:text-foreground transition-colors">
              COOKIE POLICY
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              TERMS OF SERVICE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

