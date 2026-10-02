import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { authService, type UserProfile } from "@/services/authService";
import { AuthGateModal } from "./AuthGateModal";
import { ArrowRight, Calendar, Sparkles, FolderPlus } from "lucide-react";

export function ReadyToBuildCTA({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    authService.getCurrentUser(),
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"project" | "call" | null>(null);

  const handleProjectClick = () => {
    const user = authService.getCurrentUser();
    if (user) {
      navigate({ to: "/request-project" });
    } else {
      setPendingAction("project");
      setAuthModalOpen(true);
    }
  };

  const handleCallClick = () => {
    const user = authService.getCurrentUser();
    if (user) {
      navigate({ to: "/book-call" });
    } else {
      setPendingAction("call");
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (pendingAction === "project") {
      navigate({ to: "/request-project" });
    } else if (pendingAction === "call") {
      navigate({ to: "/book-call" });
    }
    setPendingAction(null);
  };

  return (
    <section
      className={`relative overflow-hidden border-t border-border/80 bg-black/40 py-20 px-5 ${className}`}
    >
      <div className="mx-auto max-w-4xl rounded-3xl border border-border/80 bg-card/90 p-8 md:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div>
          <span className="font-mono text-xs text-steel uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> COLLABORATION & INITIATION
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Ready to build something?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Choose your preferred path. Submit a structured project brief, schedule an engineering
            consultation call, or explore our full suite of technical capabilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          {/* Option 1: START A PROJECT (Complete White Button) */}
          <button
            onClick={handleProjectClick}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.02] font-bold shadow-xl"
          >
            <FolderPlus className="h-4 w-4" />
            <span>START A PROJECT</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Option 2: BOOK A CALL (Complete White Button) */}
          <button
            onClick={handleCallClick}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.02] font-bold shadow-xl"
          >
            <Calendar className="h-4 w-4" />
            <span>BOOK A CALL</span>
          </button>

          {/* Option 3: SEE OUR WORK (Complete White Button) */}
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.02] font-bold shadow-xl"
          >
            <span>SEE OUR WORK</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Option 4: EXPLORE SERVICES (Complete White Button) */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.02] font-bold shadow-xl"
          >
            <span>EXPLORE SERVICES</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Auth Gating Modal */}
      <AuthGateModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Let's get started"
        subtitle={
          pendingAction === "project"
            ? "Sign in or create an account to submit your project brief."
            : "Sign in or create an account to schedule an engineering meeting."
        }
      />
    </section>
  );
}
