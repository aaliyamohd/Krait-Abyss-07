import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { authService, type UserProfile } from "@/services/authService";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  KeySquare,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Restricted Admin Portal | Krait Abyss" },
      {
        name: "description",
        content: "Secure Zero-Trust Admin Portal Authentication for Krait Abyss.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SecureAdminPage,
});

function SecureAdminPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [pending2FAUserId, setPending2FAUserId] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Always clear session when entering /admin so user MUST authenticate freshly
    authService.logout();
    setCurrentUser(null);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail !== "kraitabyss07@gmail.com" || password !== "@Krait#2005$") {
      setErrorMsg("Access Denied: Invalid admin credentials. Only kraitabyss07@gmail.com is authorized to access Admin Portal.");
      
      // Dispatch security email notification to admin upon failed access attempt
      try {
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY || ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Krait Security Firewall <onboarding@resend.dev>",
            to: ["kraitabyss07@gmail.com"],
            subject: "[SECURITY WARNING] Blocked Unauthorized Admin Login Attempt",
            html: `
              <div style="font-family: monospace; background: #0b0d17; color: #ff5555; padding: 24px; border-radius: 12px; border: 1px solid #ff3333;">
                <h2 style="color: #ff3333; margin-top: 0; font-size: 18px;">⚠️ KRAIT ABYSS INTRUSION ALERT</h2>
                <p style="color: #e0e0e0;">An invalid login attempt was detected on the Admin Portal and automatically blocked.</p>
                <hr style="border-color: #333;" />
                <p><strong>Attempted Email:</strong> ${cleanEmail}</p>
                <p><strong>Timestamp:</strong> ${new Date().toUTCString()}</p>
                <p><strong>Browser/Device:</strong> ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
                <p><strong>Protection Action:</strong> Access Denied & Incident Logged.</p>
                <hr style="border-color: #333;" />
                <p style="color: #888; font-size: 11px;">If this was you entering a wrong password, you can safely ignore this alert. If you did not attempt to log in, please ensure your system credentials remain confidential.</p>
              </div>
            `,
          }),
        }).catch(() => {});
      } catch {
        // Silent catch for resilience
      }
      return;
    }

    if (!turnstileToken) {
      setErrorMsg("Please complete the Cloudflare security verification challenge.");
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate via master admin auth service
      const clientRes = await authService.login({ email: cleanEmail, password });
      if (clientRes.success && clientRes.user && clientRes.user.role === "ADMIN") {
        setSuccessMsg("Admin Authentication Successful! Loading Control Panel...");
        setCurrentUser(clientRes.user);
        setTimeout(() => {
          navigate({ to: "/dashboard", search: { tab: "ADMIN_REQUESTS" }, replace: true });
        }, 800);
      } else {
        setErrorMsg(clientRes.message || "Access Denied: Invalid credentials for Admin portal.");
      }
    } catch {
      setErrorMsg("Authentication failed. Please check credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim() || !pending2FAUserId) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await authService.verify2FALogin(pending2FAUserId, twoFactorCode.trim());
      if (res.success) {
        setSuccessMsg("2FA Verified! Unlocking Admin Control Panel...");
        setTimeout(() => {
          navigate({ to: "/dashboard", search: { tab: "ADMIN_SHOWCASE" }, replace: true });
        }, 800);
      } else {
        setErrorMsg(res.message || "Invalid 2FA code. Please check your authenticator app.");
      }
    } catch {
      setErrorMsg("Failed to verify 2FA token.");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser && currentUser.role === "ADMIN") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <ShieldCheck className="h-12 w-12 text-emerald-400 mb-3 animate-pulse" />
        <h2 className="text-lg font-bold text-foreground font-mono">Admin Session Verified</h2>
        <p className="text-xs text-muted-foreground mt-1">Redirecting to Admin Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-abyss">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-xl">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground uppercase">
            Restricted Admin Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Zero-Trust Protected Area. Authorized Administrator Credentials & 2FA Required.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-rose-500/30 bg-card/90 p-6 shadow-2xl backdrop-blur-xl space-y-5">
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-3.5 text-xs text-rose-400 flex items-start gap-2.5 font-mono">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 flex items-start gap-2.5 font-mono">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {pending2FAUserId ? (
            /* 2FA Step */
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <KeySquare className="h-3 w-3 text-rose-400" />
                  <span>2FA TOTP Code / Backup Code</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={10}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="Enter 6-digit code or XXXX-XXXX"
                  className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-rose-500/80 transition-colors font-mono text-center tracking-widest text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-mono text-xs uppercase tracking-widest text-black font-bold hover:bg-rose-400 transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>{isLoading ? "Verifying Token..." : "Confirm 2FA & Access Dashboard"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setPending2FAUserId(null)}
                className="w-full text-center text-xs font-mono text-muted-foreground hover:text-foreground pt-1"
              >
                ← Back to Password Login
              </button>
            </form>
          ) : (
            /* Standard Login Form with Turnstile */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-rose-400" />
                  <span>Admin Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter authorized admin email"
                  className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-rose-500/80 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="h-3 w-3 text-rose-400" />
                  <span>Admin Master Password</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter master password"
                    className="w-full rounded-xl border border-border/80 bg-background/80 pl-3.5 pr-10 py-2.5 text-xs text-foreground focus:outline-none focus:border-rose-500/80 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-steel" />
                    ) : (
                      <Eye className="h-4 w-4 text-steel" />
                    )}
                  </button>
                </div>
              </div>

              {/* Cloudflare Turnstile Verification Widget */}
              <TurnstileWidget
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
              />

              <button
                type="submit"
                disabled={isLoading || !turnstileToken}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-mono text-xs uppercase tracking-widest text-black font-bold hover:bg-rose-400 transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>{isLoading ? "Verifying Credentials..." : "Unlock Admin Control Panel"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/dashboard"
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return to Standard Client Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
