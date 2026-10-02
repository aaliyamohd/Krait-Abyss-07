import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  Lock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { authService, type UserProfile } from "@/services/authService";

interface TwoFactorSetupProps {
  user: UserProfile;
  onStatusChange?: (enabled: boolean) => void;
}

type Step = "idle" | "scanning" | "backup_codes" | "active";

export function TwoFactorSetup({ user, onStatusChange }: TwoFactorSetupProps) {
  const [step, setStep] = useState<Step>(user.twoFactorEnabled ? "active" : "idle");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [tempSecret, setTempSecret] = useState("");
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(false);

  // 1. Generate 2FA Secret & QR Code
  async function handleStartSetup() {
    setErrorMsg("");
    setIsLoading(true);
    try {
      // Generate secret & QR code URL
      const result = await authService.generate2FASetup();
      setOtpauthUrl(result.otpauthUrl);
      setManualKey(result.tempSecret);
      setTempSecret(result.tempSecret);
      setStep("scanning");
    } catch (e: unknown) {
      setErrorMsg((e as Error).message || "Failed to initiate 2FA setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // 2. Confirm 6-Digit TOTP Code
  async function handleConfirmCode() {
    if (code.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit verification code.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await authService.verify2FASetup(user.id, tempSecret, code);
      if (res.success) {
        setBackupCodes(res.backupCodes || []);
        setStep("backup_codes");
        onStatusChange?.(true);
      } else {
        setErrorMsg(res.message || "Invalid authentication code. Please check your app.");
      }
    } catch (e: unknown) {
      setErrorMsg((e as Error).message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Complete Setup & Proceed to Active state
  function handleFinishSetup() {
    setStep("active");
  }

  // 4. Disable 2FA
  async function handleDisable2FA() {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await authService.toggle2FA(user.id, false);
      if (res.success) {
        setStep("idle");
        setDisableConfirm(false);
        onStatusChange?.(false);
      } else {
        setErrorMsg(res.message || "Failed to disable 2FA.");
      }
    } catch (e: unknown) {
      setErrorMsg((e as Error).message || "Error disabling 2FA.");
    } finally {
      setIsLoading(false);
    }
  }

  // Helper: Copy string to clipboard
  function copyToClipboard(text: string, type: "key" | "backup") {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    }
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl border shrink-0 ${
              step === "active" || user.twoFactorEnabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}
          >
            {step === "active" || user.twoFactorEnabled ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <KeyRound className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                Two-Factor Authentication (TOTP 2FA)
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wide border ${
                  step === "active" || user.twoFactorEnabled
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                {step === "active" || user.twoFactorEnabled ? "Active & Protected" : "Disabled"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Secure your account using standard TOTP authenticator apps (Google Authenticator,
              1Password, Authy).
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-400 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: IDLE / NOT ENABLED */}
      {step === "idle" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border/50 bg-background/50 p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Why enable 2FA?</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground/80">
              <li>Protects your infrastructure & account settings from unauthorized logins.</li>
              <li>Generates a time-based 6-digit code on your mobile device.</li>
              <li>Includes 10 single-use emergency backup codes for recovery.</li>
            </ul>
          </div>

          <button
            onClick={handleStartSetup}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-400 disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating Key...</span>
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4" />
                <span>Enable Two-Factor Authentication</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 2: SCANNING QR CODE & ENTERING INITIAL TOTP */}
      {step === "scanning" && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: QR Code Box */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border/80 bg-black/60 shadow-inner">
              <div className="p-3 bg-white rounded-xl shadow-md">
                {otpauthUrl ? (
                  <QRCodeSVG value={otpauthUrl} size={180} level="M" />
                ) : (
                  <div className="h-[180px] w-[180px] flex items-center justify-center text-black">
                    <QrCode className="h-12 w-12 animate-pulse text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-3 text-center">
                Scan with Google Authenticator or 1Password
              </p>
            </div>

            {/* Right: Manual Key & Verification Code Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                  Manual Entry Secret Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-xl border border-border/80 bg-background/80 px-3 py-2 font-mono text-xs text-amber-400 tracking-widest overflow-x-auto select-all">
                    {manualKey || "GENERATING..."}
                  </code>
                  <button
                    onClick={() => copyToClipboard(manualKey, "key")}
                    className="p-2 rounded-xl border border-border/80 bg-background/60 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Key"
                  >
                    {copiedKey ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                  Enter 6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full rounded-xl border border-amber-500/50 bg-background/80 px-4 py-2.5 text-center font-mono text-lg font-bold tracking-[0.4em] text-foreground focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleConfirmCode}
                  disabled={isLoading || code.length !== 6}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Activate</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep("idle")}
                  className="px-4 py-2.5 rounded-xl border border-border/80 bg-background/40 hover:bg-secondary/40 text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: BACKUP CODES DISPLAY */}
      {step === "backup_codes" && (
        <div className="mt-6 space-y-5 animate-in fade-in">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-300">2FA Successfully Enabled!</p>
              <p className="text-emerald-400/90 text-[11px] mt-0.5">
                Save these emergency backup codes. Each code can be used ONCE to sign in if you lose
                access to your device.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-black/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                10 One-Time Backup Codes
              </span>
              <button
                onClick={() => copyToClipboard(backupCodes.join("\n"), "backup")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border/80 bg-secondary/40 hover:bg-secondary text-xs font-mono text-foreground transition-all cursor-pointer"
              >
                {copiedBackup ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied All</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy All Codes</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs text-amber-300 text-center">
              {backupCodes.map((c, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl border border-amber-500/20 bg-amber-500/5 select-all"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleFinishSetup}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-background hover:opacity-90 cursor-pointer"
          >
            I Have Saved My Backup Codes
          </button>
        </div>
      )}

      {/* STEP 4: ACTIVE STATE */}
      {step === "active" && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground font-mono uppercase">
                  Account Protected by TOTP
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Verification is active. You will be prompted for a security code during sign in.
                </p>
              </div>
            </div>

            {!disableConfirm ? (
              <button
                onClick={() => setDisableConfirm(true)}
                className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 font-mono text-xs font-bold uppercase text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer shrink-0"
              >
                Disable 2FA
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDisable2FA}
                  disabled={isLoading}
                  className="rounded-xl bg-rose-600 px-3 py-1.5 font-mono text-xs font-bold uppercase text-white hover:bg-rose-500 transition-all cursor-pointer"
                >
                  {isLoading ? "Disabling..." : "Confirm Disable"}
                </button>
                <button
                  onClick={() => setDisableConfirm(false)}
                  className="rounded-xl border border-border/80 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
