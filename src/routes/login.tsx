import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Get in Touch | Krait Abyss" },
      {
        name: "description",
        content: "Contact Krait Abyss to start a project or schedule a call directly.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPageRedirect,
});

function LoginPageRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/contact", replace: true });
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-2xl border border-border/80 bg-card/90 p-8 shadow-2xl backdrop-blur-xl">
        <MessageSquare className="mx-auto h-10 w-10 text-steel mb-4" />
        <h1 className="text-xl font-bold text-foreground">Direct Contact Mode Active</h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Authentication is not required. Redirecting to the direct inquiry &amp; booking portal...
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-background font-semibold"
        >
          <span>Go to Contact Page</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
