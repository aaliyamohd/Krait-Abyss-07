import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Reusable Krait Abyss content box. */
export function Panel({
  children,
  className = "",
  label,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  hover?: boolean;
}) {
  return (
    <div className={`k-card ${hover ? "k-card-hover" : ""} p-6 ${className}`}>
      {label ? <p className="k-label mb-4">{label}</p> : null}
      {children}
    </div>
  );
}

/** Section header used on every page for a single visual language. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="k-label">{eyebrow}</p>
      <h2
        id={id}
        className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

const base =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:-translate-y-0.5";

const variants = {
  primary: "bg-primary text-primary-foreground hover:brightness-105 hover:shadow-lg",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-foreground/40 hover:bg-secondary/60",
} as const;

type Variant = keyof typeof variants;

export function BtnLink({
  to,
  params,
  children,
  variant = "primary",
  className = "",
}: {
  to: string;
  params?: Record<string, string>;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      params={params as never}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Btn({
  children,
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button {...rest} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

/** Terminal / code style panel used across pages. */
export function CodePanel({ lines, title }: { lines: string[]; title?: string }) {
  return (
    <div className="code-box overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/25" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/15" />
        <span className="ml-2 text-[0.65rem] tracking-[0.2em] text-muted-foreground">
          {title ?? "KRAIT_ABYSS"}
        </span>
      </div>
      <div className="space-y-1 px-4 py-4">
        {lines.map((l) => (
          <p key={l}>
            <span className="text-accent">›</span> {l}
          </p>
        ))}
      </div>
    </div>
  );
}
