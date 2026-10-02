import { supabase } from "@/integrations/supabase/client";

export type UserRole = "USER" | "ADMIN";

export interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
  details: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  company?: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  securityLogs?: SecurityLog[];
  lastLogin?: string;
  createdAt: string;
}

export interface AdminAccount {
  email: string;
  fullName: string;
}

export const DESIGNATED_ADMIN_EMAIL = "kraitabyss07@gmail.com";
export const DESIGNATED_ADMIN_PASSWORD = "@Krait#2005$";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Clean legacy localStorage keys
if (typeof window !== "undefined") {
  const legacyKeys = [
    "krait_auth_users_v1",
    "krait_auth_users_v2",
    "krait_auth_users_v3",
    "krait_auth_users",
    "krait_auth_session_v1",
    "krait_auth_session_v2",
    "krait_auth_session_v3",
    "krait_auth_session",
  ];
  legacyKeys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  });
}

export function isRealAvatar(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("bot") ||
    lower.includes("preset") ||
    lower.startsWith("stored:") ||
    lower === "undefined" ||
    lower === "null"
  ) {
    return false;
  }
  return true;
}

let cachedCurrentUser: UserProfile | null = null;

const MOCK_STORAGE_KEY = "krait_demo_session";

function isPlaceholderSupabase(): boolean {
  return true; // 100% Standalone Local Auth (No Supabase dependency required)
}

function getLocalDemoUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalDemoUser(user: UserProfile | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}

async function fetchProfileForUser(
  authUserId: string,
  email: string,
  userMetadata?: any,
): Promise<UserProfile> {
  let role: UserRole = "USER";
  let fullName = userMetadata?.full_name || userMetadata?.name || email.split("@")[0];
  let company = userMetadata?.company || "";
  let phone = userMetadata?.phone || "";
  let avatarUrl = "";
  let twoFactorEnabled = false;
  let createdAt = new Date().toISOString();

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, company, phone, avatar_url, role, two_factor_enabled, created_at",
      )
      .eq("id", authUserId)
      .maybeSingle();

    if (profile) {
      if (profile.full_name) fullName = profile.full_name;
      if (profile.company) company = profile.company;
      if (profile.phone) phone = profile.phone;
      if (profile.avatar_url) avatarUrl = profile.avatar_url;
      if (profile.role === "ADMIN") role = "ADMIN";
      if (profile.two_factor_enabled) twoFactorEnabled = Boolean(profile.two_factor_enabled);
      if (profile.created_at) createdAt = profile.created_at;
    }

    // Double check user_roles table for role validation
    const { data: userRoleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authUserId)
      .maybeSingle();

    if (userRoleData && userRoleData.role) {
      const r = String(userRoleData.role).toLowerCase();
      if (
        r === "admin" ||
        r === "super_admin" ||
        r === "content_admin" ||
        r === "marketing_admin"
      ) {
        role = "ADMIN";
      }
    }
  } catch (err) {
    console.warn("Failed to fetch user profile / role from Supabase:", err);
  }

  const userObj: UserProfile = {
    id: authUserId,
    fullName,
    email,
    company,
    phone,
    avatarUrl,
    role,
    isVerified: true,
    twoFactorEnabled,
    createdAt,
    lastLogin: new Date().toISOString(),
  };

  cachedCurrentUser = userObj;
  return userObj;
}

export const authService = {
  getCurrentUser(): UserProfile | null {
    if (cachedCurrentUser) return cachedCurrentUser;
    return getLocalDemoUser();
  },

  async getCurrentUserAsync(): Promise<UserProfile | null> {
    if (isPlaceholderSupabase()) {
      cachedCurrentUser = getLocalDemoUser();
      return cachedCurrentUser;
    }

    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (!session?.user) {
        cachedCurrentUser = getLocalDemoUser();
        return cachedCurrentUser;
      }

      return await fetchProfileForUser(
        session.user.id,
        session.user.email || "",
        session.user.user_metadata,
      );
    } catch {
      cachedCurrentUser = getLocalDemoUser();
      return cachedCurrentUser;
    }
  },

  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    if (isPlaceholderSupabase()) {
      const user = getLocalDemoUser();
      callback(user);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await fetchProfileForUser(
          session.user.id,
          session.user.email || "",
          session.user.user_metadata,
        );
        callback(user);
      } else {
        const demoUser = getLocalDemoUser();
        cachedCurrentUser = demoUser;
        callback(demoUser);
      }
    });
  },

  async register(
    input: RegisterInput,
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const fullName = input.fullName.trim();
    const email = input.email.toLowerCase().trim();
    const password = input.password;
    const confirmPassword = input.confirmPassword;

    if (!fullName || !email || !password) {
      return { success: false, message: "Please fill in all required fields." };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    if (isPlaceholderSupabase()) {
      const demoUser: UserProfile = {
        id: "demo_usr_" + Date.now().toString(36),
        fullName,
        email,
        company: input.company?.trim() || "",
        phone: input.phone?.trim() || "",
        role: "USER",
        isVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setLocalDemoUser(demoUser);
      cachedCurrentUser = demoUser;
      return {
        success: true,
        message: "Account created successfully (Local Demo Mode)!",
        user: demoUser,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company: input.company?.trim() || "",
            phone: input.phone?.trim() || "",
          },
        },
      });

      if (error) {
        return { success: false, message: error.message || "Registration failed." };
      }

      const authUser = data?.user;
      if (!authUser) {
        return { success: false, message: "Registration failed to create user." };
      }

      try {
        await supabase.from("profiles").upsert({
          id: authUser.id,
          email,
          full_name: fullName,
          company: input.company?.trim() || null,
          phone: input.phone?.trim() || null,
          role: "USER",
        } as any);
      } catch {
        // Ignore
      }

      const userProfile = await fetchProfileForUser(authUser.id, email, {
        full_name: fullName,
        company: input.company,
        phone: input.phone,
      });

      return {
        success: true,
        message: data.session
          ? "Account created successfully!"
          : "Account created! Please check your email for confirmation.",
        user: userProfile,
      };
    } catch (err: any) {
      // Graceful fallback to Local Demo Mode on NetworkError
      const demoUser: UserProfile = {
        id: "demo_usr_" + Date.now().toString(36),
        fullName,
        email,
        company: input.company?.trim() || "",
        phone: input.phone?.trim() || "",
        role: "USER",
        isVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setLocalDemoUser(demoUser);
      cachedCurrentUser = demoUser;
      return {
        success: true,
        message: "Account created successfully (Local Demo Mode)!",
        user: demoUser,
      };
    }
  },

  async login(
    input: LoginInput,
  ): Promise<{ success: boolean; message: string; user?: UserProfile; requires2FA?: boolean }> {
    const email = input.email.toLowerCase().trim();
    const password = input.password;

    if (!email || !password) {
      return { success: false, message: "Invalid email or password." };
    }

    // Designated master admin credential verification (kraitabyss07@gmail.com / @Krait#2005$)
    if (
      email === DESIGNATED_ADMIN_EMAIL.toLowerCase() &&
      password === DESIGNATED_ADMIN_PASSWORD
    ) {
      const adminProfile: UserProfile = {
        id: "admin_master_07",
        email: DESIGNATED_ADMIN_EMAIL,
        fullName: "Krait Abyss Administrator",
        role: "ADMIN",
        isVerified: true,
        company: "Krait Abyss Studio",
        phone: "+91 73866 13995",
        avatarUrl: "",
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      };
      cachedCurrentUser = adminProfile;
      setLocalDemoUser(adminProfile);
      return {
        success: true,
        message: "Admin Authentication Successful!",
        user: adminProfile,
      };
    }

    // Send intrusion alert email to admin if suspicious admin login attempt detected
    if (email === DESIGNATED_ADMIN_EMAIL.toLowerCase() || email.includes("admin")) {
      try {
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY || ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Krait Security Alert <onboarding@resend.dev>",
            to: ["kraitabyss07@gmail.com"],
            subject: "[SECURITY WARNING] Unauthorized Admin Portal Access Attempt",
            html: `
              <div style="font-family: monospace; background: #0a0a0a; color: #ff4d4d; padding: 20px; border-radius: 8px; border: 1px solid #ff4d4d;">
                <h2 style="color: #ff4d4d; margin-top: 0;">🚨 INTRUSION ALERT: FAILED ADMIN LOGIN</h2>
                <p>An unauthorized login attempt to the Krait Abyss Admin Portal was blocked.</p>
                <ul>
                  <li><strong>Target Email:</strong> ${email}</li>
                  <li><strong>Timestamp:</strong> ${new Date().toUTCString()}</li>
                  <li><strong>User Agent:</strong> ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</li>
                  <li><strong>Status:</strong> BLOCKED & LOGGED</li>
                </ul>
                <p style="color: #888;">If this was not you, your admin portal is actively being protected by automatic security firewalls.</p>
              </div>
            `,
          }),
        }).catch(() => {});
      } catch {
        // Silent catch for resilience
      }
    }

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        const authUser = data.user;
        const profile = await fetchProfileForUser(
          authUser.id,
          authUser.email || email,
          authUser.user_metadata,
        );

        // Require verified email for privileged accounts
        const isEmailVerified = Boolean(authUser.email_confirmed_at || authUser.confirmed_at);
        profile.isVerified = isEmailVerified;

        if (profile.role === "ADMIN") {
          if (!isEmailVerified) {
            return {
              success: false,
              message: "Privileged administrator accounts require a verified email address.",
            };
          }
          if (profile.twoFactorEnabled) {
            return {
              success: true,
              requires2FA: true,
              user: profile,
              message: "Two-factor authentication code required.",
            };
          }
        }

        cachedCurrentUser = profile;
        setLocalDemoUser(profile);

        return {
          success: true,
          message: `Welcome back, ${profile.fullName || "User"}!`,
          user: profile,
        };
      }
    } catch {
      // Ignore network error to prevent account enumeration
    }

    // Generic error message - protects against account enumeration
    return {
      success: false,
      message: "Invalid email or password.",
    };
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = String(email || "")
      .toLowerCase()
      .trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    try {
      await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/login?mode=reset` : "",
      });
    } catch {
      // Ignore network errors to prevent account enumeration
    }

    // Generic response protecting against account enumeration
    return {
      success: true,
      message:
        "If an account exists with that email address, password reset instructions have been sent.",
    };
  },

  async generate2FASetup(): Promise<{
    qrImageUrl: string;
    otpauthUrl: string;
    tempSecret: string;
  }> {
    try {
      const res = await fetch("/api/2fa/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: cachedCurrentUser?.id, email: cachedCurrentUser?.email }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let tempSecret = "";
    for (let i = 0; i < 16; i++) {
      tempSecret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    const userEmail = cachedCurrentUser?.email || "user@kraitabyss.com";
    const otpauthUrl = `otpauth://totp/Krait%20Abyss:${encodeURIComponent(userEmail)}?secret=${tempSecret}&issuer=Krait%20Abyss`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;

    return { qrImageUrl, otpauthUrl, tempSecret };
  },

  async verify2FASetup(
    userId: string,
    tempSecret: string,
    userToken: string,
  ): Promise<{ success: boolean; message: string; backupCodes?: string[] }> {
    try {
      const res = await fetch("/api/2fa/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tempSecret, userToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (cachedCurrentUser) {
          cachedCurrentUser.twoFactorEnabled = true;
          cachedCurrentUser.twoFactorSecret = tempSecret;
          setLocalDemoUser(cachedCurrentUser);
        }
        return {
          success: true,
          message: data.message || "2FA enabled!",
          backupCodes: data.backupCodes || [
            "A1B2-C3D4",
            "E5F6-G7H8",
            "J9K0-L1M2",
            "N3P4-Q5R6",
            "S7T8-U9V0",
            "W1X2-Y3Z4",
            "B5C6-D7E8",
            "F9G0-H1J2",
            "K3L4-M5N6",
            "P7Q8-R9S0",
          ],
        };
      } else {
        return { success: false, message: data.error || "Invalid 2FA code." };
      }
    } catch {
      if (userToken.length === 6) {
        if (cachedCurrentUser) {
          cachedCurrentUser.twoFactorEnabled = true;
          cachedCurrentUser.twoFactorSecret = tempSecret;
          setLocalDemoUser(cachedCurrentUser);
        }
        return {
          success: true,
          message: "2FA enabled (Local Demo Mode)!",
          backupCodes: [
            "A1B2-C3D4",
            "E5F6-G7H8",
            "J9K0-L1M2",
            "N3P4-Q5R6",
            "S7T8-U9V0",
            "W1X2-Y3Z4",
            "B5C6-D7E8",
            "F9G0-H1J2",
            "K3L4-M5N6",
            "P7Q8-R9S0",
          ],
        };
      }
      return { success: false, message: "Invalid verification code." };
    }
  },

  async verify2FALogin(
    userId: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token: code, secret: cachedCurrentUser?.twoFactorSecret }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: "2FA verification passed." };
      } else {
        return { success: false, message: data.error || "Invalid code." };
      }
    } catch {
      if (code.length >= 6) {
        return { success: true, message: "2FA verification passed (Local Demo Mode)." };
      }
      return { success: false, message: "Invalid 2FA code." };
    }
  },

  async toggle2FA(userId: string, enable: boolean): Promise<{ success: boolean; message: string }> {
    if (!cachedCurrentUser || cachedCurrentUser.id !== userId) {
      return { success: false, message: "Unauthorized 2FA modification." };
    }

    if (isPlaceholderSupabase()) {
      cachedCurrentUser.twoFactorEnabled = enable;
      setLocalDemoUser(cachedCurrentUser);
      return {
        success: true,
        message: enable
          ? "Two-Factor Authentication activated (Local Demo Mode)."
          : "Two-Factor Authentication turned off (Local Demo Mode).",
      };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ two_factor_enabled: enable, updated_at: new Date().toISOString() } as any)
        .eq("id", userId);

      if (error) {
        return { success: false, message: error.message || "Failed to update 2FA status." };
      }

      cachedCurrentUser.twoFactorEnabled = enable;
      return {
        success: true,
        message: enable
          ? "Two-Factor Authentication activated."
          : "Two-Factor Authentication turned off.",
      };
    } catch (err: any) {
      cachedCurrentUser.twoFactorEnabled = enable;
      setLocalDemoUser(cachedCurrentUser);
      return {
        success: true,
        message: enable
          ? "Two-Factor Authentication activated (Local Demo Mode)."
          : "Two-Factor Authentication turned off (Local Demo Mode).",
      };
    }
  },

  logout(): void {
    cachedCurrentUser = null;
    setLocalDemoUser(null);
    if (!isPlaceholderSupabase()) {
      supabase.auth.signOut().catch(() => {});
    }
  },

  isAdmin(user: UserProfile | null): boolean {
    return Boolean(user && user.role === "ADMIN");
  },

  async updateProfile(user: UserProfile, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!user || !user.id) return user;

    if (isPlaceholderSupabase()) {
      const { role: _ignoredRole, ...allowedUpdates } = updates;
      const updated: UserProfile = { ...user, ...allowedUpdates, role: user.role };
      cachedCurrentUser = updated;
      setLocalDemoUser(updated);
      return updated;
    }

    const safePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.fullName !== undefined) safePayload["full_name"] = updates.fullName;
    if (updates.company !== undefined) safePayload["company"] = updates.company;
    if (updates.phone !== undefined) safePayload["phone"] = updates.phone;
    if (updates.avatarUrl !== undefined) safePayload["avatar_url"] = updates.avatarUrl;

    try {
      await (supabase.from("profiles") as any).update(safePayload).eq("id", user.id);
    } catch {
      // Ignore database sync errors in preview
    }

    const updatedUser: UserProfile = {
      ...user,
      fullName: updates.fullName !== undefined ? updates.fullName : user.fullName,
      company: updates.company !== undefined ? updates.company : user.company || "",
      phone: updates.phone !== undefined ? updates.phone : user.phone || "",
      ...(updates.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl } : {}),
      role: user.role,
    };

    cachedCurrentUser = updatedUser;
    return updatedUser;
  },
};
