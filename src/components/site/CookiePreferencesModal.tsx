import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Check, X, Lock } from "lucide-react";

const CONSENT_KEY = "krait_cookie_consent_v1";

export function CookiePreferencesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [preferences, setPreferences] = useState({
    necessary: true,
    preferences: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (all = false) => {
    const updated = {
      necessary: true,
      preferences: true,
      analytics: all,
      marketing: all,
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-steel/40 bg-[#0d0f14]/95 p-6 backdrop-blur-2xl shadow-2xl space-y-6 text-foreground">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-steel/10 border border-steel/30 text-steel">
              <Cookie className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cookie &amp; Storage Preferences</h3>
              <p className="font-mono text-[10px] text-muted-foreground">Krait Abyss Privacy Manager</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            We use browser storage strictly to maintain session authentication, security anti-bot checks (Cloudflare Turnstile), and your preferences. We do NOT use third-party advertising trackers or Meta Pixel.
          </p>

          <div className="space-y-3 pt-2">
            {/* Category 1: Necessary */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span>Strictly Necessary Storage</span>
                  <span className="rounded bg-steel/20 text-steel px-1.5 py-0.2 font-mono text-[9px]">REQUIRED</span>
                </span>
                <p className="text-[11px] text-muted-foreground">Session authentication tokens &amp; Turnstile security challenge.</p>
              </div>
              <input type="checkbox" checked disabled className="h-4 w-4 accent-steel opacity-80 cursor-not-allowed" />
            </div>

            {/* Category 2: Preferences */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">Site Preferences</span>
                <p className="text-[11px] text-muted-foreground">Remembers UI preferences and consent state.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(e) => setPreferences((p) => ({ ...p, preferences: e.target.checked }))}
                className="h-4 w-4 accent-steel cursor-pointer"
              />
            </div>
          </div>
        </div>

        {saved && (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 font-bold">
            <Check className="h-4 w-4" />
            <span>Preferences Saved Successfully</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-border/80">
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="rounded-xl border border-steel/40 bg-steel/10 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-steel hover:bg-steel/20 transition-all"
          >
            Save Selected
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="rounded-xl bg-foreground px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-background hover:scale-105 transition-all shadow-lg"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
