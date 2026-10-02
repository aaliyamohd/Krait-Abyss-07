import { useState, type FormEvent } from "react";
import { authService, type UserProfile } from "@/services/authService";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  title?: string;
  subtitle?: string;
  defaultMode?: "login" | "register";
}

export function AuthGateModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Let's get started",
  subtitle = "Sign in or create an account to proceed with your request.",
  defaultMode = "login",
}: AuthGateModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "2fa">(defaultMode);

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  // UI state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const res = await authService.login({ email, password });
    setIsLoading(false);

    if (res.success && res.user) {
      if (res.requires2FA) {
        setPendingUser(res.user);
        setMode("2fa");
        setErrorMsg("");
      } else {
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 400);
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  const handle2FASubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const res = await authService.verify2FALogin(pendingUser.id, twoFactorCode);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg("2FA verified! Logging in...");
      setTimeout(() => {
        onSuccess(pendingUser);
        onClose();
      }, 400);
    } else {
      setErrorMsg(res.message || "Invalid 2FA code.");
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const res = await authService.register({
      fullName,
      email,
      password,
      confirmPassword,
      company,
      phone,
    });
    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessMsg("Account created. Check your email to verify your account.");
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const res = await authService.requestPasswordReset(email);
    setIsLoading(false);
    setSuccessMsg(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <ShieldCheck className="h-5 w-5 text-steel" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {mode === "forgot" ? "Reset Password" : title}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "forgot" ? "Enter your email to receive a secure reset link." : subtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== "forgot" && (
          <div className="mb-5 flex rounded-xl border border-border/60 bg-background/60 p-1">
            <button
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                mode === "login"
                  ? "bg-card text-foreground shadow-sm border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => {
                setMode("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                mode === "register"
                  ? "bg-card text-foreground shadow-sm border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[10px] font-mono text-steel hover:underline"
                >
                  FORGOT PASSWORD?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border bg-background text-steel focus:ring-0"
                />
                <span className="text-[11px] text-muted-foreground">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-background font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            >
              <span>{isLoading ? "AUTHENTICATING..." : "SIGN IN TO CONTINUE"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Confirm *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Company / Organization (Optional)
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Tech Labs"
                  className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Phone Number (Optional)
              </label>
              <div className="flex gap-2">
                <select
                  defaultValue="+91"
                  onChange={(e) => {
                    if (!phone.startsWith(e.target.value)) {
                      setPhone(e.target.value + " ");
                    }
                  }}
                  className="rounded-xl border border-border/80 bg-background/60 px-2 py-2 text-xs text-foreground focus:border-primary/60 focus:outline-none font-mono"
                >
                  <option value="+91">🇮🇳 +91 (IN)</option>
                  <option value="+1">🇺🇸 +1 (US)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                  <option value="+966">🇸🇦 +966 (KSA)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+61">🇦🇺 +61 (AU)</option>
                  <option value="+49">🇩🇪 +49 (DE)</option>
                  <option value="+65">🇸🇬 +65 (SG)</option>
                  <option value="+">🌐 Other</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-background font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            >
              <span>{isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-background font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            >
              <span>{isLoading ? "SENDING LINK..." : "SEND RESET LINK"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="w-full text-center text-xs font-mono text-muted-foreground hover:text-foreground mt-2"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* MODE 4: 2FA VERIFICATION FORM */}
        {mode === "2fa" && (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
              <p className="text-xs font-bold text-amber-400 font-mono uppercase mb-1">
                2FA Security Check Required
              </p>
              <p className="text-[11px] text-muted-foreground">
                Enter the 6-digit code from Google Authenticator / 1Password, or a 8-character
                backup code.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Authenticator / Backup Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-amber-400/80" />
                <input
                  type="text"
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456 or XXXX-XXXX"
                  className="w-full rounded-xl border border-amber-500/50 bg-background/80 pl-9 pr-3 py-2.5 font-mono text-sm tracking-widest text-foreground focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !twoFactorCode}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-black font-bold transition-all hover:bg-amber-400 disabled:opacity-50"
            >
              <span>{isLoading ? "VERIFYING..." : "VERIFY CODE & SIGN IN"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setPendingUser(null);
                setTwoFactorCode("");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="w-full text-center text-xs font-mono text-muted-foreground hover:text-foreground mt-2"
            >
              ← Cancel & Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
