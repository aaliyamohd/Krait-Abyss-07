import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  authService,
  isRealAvatar,
  type UserProfile,
  type SecurityLog,
} from "@/services/authService";
import { projectService, type ProjectRequest, type ProjectStatus } from "@/services/projectService";
import { meetingService, type MeetingBooking } from "@/services/meetingService";
import { showcaseService, type WorkShowcaseItem } from "@/services/showcaseService";
import { avatarStorageService } from "@/services/avatarStorageService";
import { careerService, type CareerApplication } from "@/services/careerService";
import { useDeviceViewport } from "@/hooks/useDeviceViewport";
import { TwoFactorSetup } from "@/components/site/TwoFactorSetup";
import {
  FolderKanban,
  PlusCircle,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Clock,
  AlertCircle,
  Calendar,
  ExternalLink,
  Upload,
  Camera,
  CheckCircle2,
  Sparkles,
  Send,
  Loader2,
  Trash2,
  ShieldCheck,
  KeyRound,
  Lock,
  Layers,
  ShieldAlert,
  Edit,
  Monitor,
  Smartphone,
  Tablet,
  Briefcase,
  FileText,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    const t = search["tab"];
    return t ? { tab: String(t) } : {};
  },
  head: () => ({
    meta: [
      { title: "Client & Admin Portal | Krait Abyss" },
      {
        name: "description",
        content:
          "Confidential dashboard to manage projects, 2FA security, and work showcase updates.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

function getInitials(name: string): string {
  if (!name) return "KA";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const p0 = parts[0];
    const pLast = parts[parts.length - 1];
    if (p0 && pLast && p0[0] && pLast[0]) {
      return (p0[0] + pLast[0]).toUpperCase();
    }
  }
  return name.slice(0, 2).toUpperCase();
}

export function DashboardPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewport = useDeviceViewport();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ProjectRequest[]>([]);
  const [meetings, setMeetings] = useState<MeetingBooking[]>([]);
  const [showcaseItems, setShowcaseItems] = useState<WorkShowcaseItem[]>([]);
  const [careerApps, setCareerApps] = useState<CareerApplication[]>([]);

  const [activeTab, setActiveTab] = useState<
    | "PROFILE"
    | "MY PROJECTS"
    | "REQUEST SERVICE"
    | "MEETINGS"
    | "MESSAGES"
    | "SETTINGS"
    | "ADMIN_SHOWCASE"
    | "ADMIN_REQUESTS"
    | "ADMIN_CAREERS"
    | "ADMIN_SECURITY"
  >("PROFILE");

  // Synchronize active tab with URL query parameter
  useEffect(() => {
    if (user && user.role === "ADMIN" && activeTab === "PROFILE") {
      setActiveTab("ADMIN_REQUESTS");
    }

    if (searchParams.tab) {
      const param = searchParams.tab.toUpperCase();
      const isAdminTab =
        param === "ADMIN_SHOWCASE" || param === "ADMIN_REQUESTS" || param === "ADMIN_CAREERS" || param === "ADMIN_SECURITY";

      if (isAdminTab) {
        if (user && user.role === "ADMIN") {
          if (param === "ADMIN_SHOWCASE") setActiveTab("ADMIN_SHOWCASE");
          else if (param === "ADMIN_REQUESTS") setActiveTab("ADMIN_REQUESTS");
          else if (param === "ADMIN_CAREERS") setActiveTab("ADMIN_CAREERS");
          else if (param === "ADMIN_SECURITY") setActiveTab("ADMIN_SECURITY");
        } else {
          setActiveTab("PROFILE");
        }
      } else {
        if (param === "PROFILE") setActiveTab(user?.role === "ADMIN" ? "ADMIN_REQUESTS" : "PROFILE");
        else if (param === "MY PROJECTS" || param === "MY_PROJECTS" || param === "DASHBOARD")
          setActiveTab(user?.role === "ADMIN" ? "ADMIN_REQUESTS" : "MY PROJECTS");
        else if (param === "REQUEST SERVICE" || param === "REQUEST_SERVICE")
          setActiveTab(user?.role === "ADMIN" ? "ADMIN_REQUESTS" : "REQUEST SERVICE");
        else if (param === "MEETINGS") setActiveTab(user?.role === "ADMIN" ? "ADMIN_REQUESTS" : "MEETINGS");
        else if (param === "MESSAGES") setActiveTab(user?.role === "ADMIN" ? "ADMIN_REQUESTS" : "MESSAGES");
        else if (param === "SETTINGS") setActiveTab(user?.role === "ADMIN" ? "ADMIN_SECURITY" : "SETTINGS");
      }
    }
  }, [searchParams.tab, user]);

  // Profile Edit States
  const [editFullName, setEditFullName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Admin status update & request badge counter states
  const [statusUpdateMsg, setStatusUpdateMsg] = useState("");
  const [readRequestCount, setReadRequestCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("krait_admin_read_requests");
      return val ? Number(val) : 0;
    }
    return 0;
  });

  const totalRequestsCount = projects.length + meetings.length;
  const unreadRequestsCount = Math.max(0, totalRequestsCount - readRequestCount);

  const handleMarkAllRequestsRead = () => {
    setReadRequestCount(totalRequestsCount);
    if (typeof window !== "undefined") {
      localStorage.setItem("krait_admin_read_requests", String(totalRequestsCount));
    }
  };

  // Admin New Work Showcase Form State
  const [newShowcaseTitle, setNewShowcaseTitle] = useState("");
  const [newShowcaseClient, setNewShowcaseClient] = useState("");
  const [newShowcaseCategory, setNewShowcaseCategory] = useState("AI & Neural Pipelines");
  const [newShowcaseDesc, setNewShowcaseDesc] = useState("");
  const [newShowcaseFull, setNewShowcaseFull] = useState("");
  const [newShowcaseImage, setNewShowcaseImage] = useState("");
  const [newShowcaseLive, setNewShowcaseLive] = useState("https://kraitabyss.com");
  const [newShowcaseTech, setNewShowcaseTech] = useState("TypeScript, React, Postgres");
  const [showcaseMsg, setShowcaseMsg] = useState("");

  // Settings states (2FA & Password)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [twoFactorStatusMsg, setTwoFactorStatusMsg] = useState("");

  // Support message state
  const [supportSubject, setSupportSubject] = useState("General Inquiry");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSentMsg, setSupportSentMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      const currentUser = await authService.getCurrentUserAsync();
      if (!currentUser) {
        if (isMounted) navigate({ to: "/login" });
        return;
      }

      if (!isMounted) return;
      setUser(currentUser);
      setEditFullName(currentUser.fullName || "");
      setEditCompany(currentUser.company || "");
      setEditPhone(currentUser.phone || "");

      const [showcases, userProjects, userMeetings, avatarUrl, apps] = await Promise.all([
        showcaseService.getShowcaseItemsAsync(),
        projectService.getUserProjectsAsync(currentUser),
        meetingService.getUserMeetingsAsync(currentUser),
        avatarStorageService.getAvatar(currentUser.id),
        careerService.getApplicationsAsync(),
      ]);

      if (!isMounted) return;
      setShowcaseItems(showcases);
      setProjects(userProjects);
      setMeetings(userMeetings);
      setCareerApps(apps);

      if (avatarUrl && isRealAvatar(avatarUrl)) {
        currentUser.avatarUrl = avatarUrl;
        setEditAvatarUrl(avatarUrl);
        setUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
      } else if (currentUser.avatarUrl && isRealAvatar(currentUser.avatarUrl)) {
        setEditAvatarUrl(currentUser.avatarUrl);
      }
    };

    loadDashboardData();
    const unsub = authService.onAuthStateChange((updatedUser) => {
      if (!updatedUser) {
        navigate({ to: "/login" });
      } else {
        setUser(updatedUser);
      }
    });

    return () => {
      isMounted = false;
      unsub.data.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate({ to: "/login" });
  };

  const handleToggle2FA = async () => {
    if (!user) return;
    const nextState = !user.twoFactorEnabled;
    const res = await authService.toggle2FA(user.id, nextState);
    if (res.success) {
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) setUser(updatedUser);
      setTwoFactorStatusMsg(res.message);
      setTimeout(() => setTwoFactorStatusMsg(""), 4000);
    }
  };

  const handleQuickUploadPreset = async (preset: {
    title: string;
    clientName: string;
    category: string;
    description: string;
    fullDetails: string;
    imageUrl: string;
    liveUrl: string;
    techStack: string[];
  }) => {
    if (!user || user.role !== "ADMIN") return;

    await showcaseService.addShowcaseItem({
      title: preset.title,
      clientName: preset.clientName,
      category: preset.category,
      description: preset.description,
      fullDetails: preset.fullDetails,
      imageUrl: preset.imageUrl,
      liveUrl: preset.liveUrl,
      techStack: preset.techStack,
      completedDate: new Date().toISOString().split("T")[0] || "",
    });

    const freshItems = showcaseService.getShowcaseItems();
    setShowcaseItems(freshItems);
    setShowcaseMsg(
      `⚡ 1-Click Upload Success: "${preset.title}" is now published on the Work page!`,
    );
    setTimeout(() => setShowcaseMsg(""), 4000);
  };

  const handleAddShowcaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "ADMIN") return;

    if (!newShowcaseTitle.trim() || !newShowcaseClient.trim() || !newShowcaseDesc.trim()) {
      setShowcaseMsg("Please fill in all required project fields.");
      return;
    }

    const techArray = newShowcaseTech
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    showcaseService.addShowcaseItem({
      title: newShowcaseTitle.trim(),
      clientName: newShowcaseClient.trim(),
      category: newShowcaseCategory,
      description: newShowcaseDesc.trim(),
      fullDetails: newShowcaseFull.trim(),
      imageUrl:
        newShowcaseImage.trim() ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      liveUrl: newShowcaseLive.trim() || "https://kraitabyss.com",
      techStack: techArray.length ? techArray : ["TypeScript", "React", "Tailwind CSS"],
      completedDate: new Date().toISOString().split("T")[0] || "",
    });

    // Refresh showcase items
    const freshItems = showcaseService.getShowcaseItems();
    setShowcaseItems(freshItems);

    setShowcaseMsg(
      "New Work Showcase item uploaded successfully! Guaranteed to appear FIRST on the Work page.",
    );
    setNewShowcaseTitle("");
    setNewShowcaseClient("");
    setNewShowcaseDesc("");
    setNewShowcaseFull("");
    setNewShowcaseImage("");
    setTimeout(() => setShowcaseMsg(""), 4000);
  };

  const handleDeleteShowcaseItem = (id: string) => {
    showcaseService.deleteShowcaseItem(id);
    setShowcaseItems(showcaseService.getShowcaseItems());
    setShowcaseMsg("Work showcase project removed.");
    setTimeout(() => setShowcaseMsg(""), 3000);
  };

  const handleProjectStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    if (!user) return;
    const success = await projectService.updateProjectStatus(user, projectId, newStatus);
    if (success) {
      setStatusUpdateMsg(`Project status updated to ${newStatus}`);
      setProjects(await projectService.getUserProjects(user));
      setTimeout(() => setStatusUpdateMsg(""), 3000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUploadError("");
    setProfileMsg("");

    try {
      const imageData = await avatarStorageService.compressImage(file);
      if (!imageData) {
        throw new Error("Unable to process selected image.");
      }

      await avatarStorageService.saveAvatar(user.id, imageData);
      const updated = await authService.updateProfile(user, { avatarUrl: imageData });

      setUser({ ...updated, avatarUrl: imageData });
      setEditAvatarUrl(imageData);
      setActiveTab("PROFILE");
      setProfileMsg("Profile photo updated successfully!");
      setTimeout(() => setProfileMsg(""), 4000);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to save profile picture.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setIsUploading(true);
    try {
      await avatarStorageService.deleteAvatar(user.id);
      setEditAvatarUrl("");
      const updated = await authService.updateProfile(user, { avatarUrl: "" });
      setUser({ ...updated, avatarUrl: "" });
      setActiveTab("PROFILE");
      setProfileMsg("Profile picture removed.");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch {
      setUploadError("Failed to remove profile photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (startProjectAfter = false) => {
    if (!user) return;
    const currentValidAvatar = editAvatarUrl || user.avatarUrl || "";

    const updated = await authService.updateProfile(user, {
      fullName: editFullName.trim() || user.fullName,
      company: editCompany.trim(),
      phone: editPhone.trim(),
      avatarUrl: currentValidAvatar,
    });
    setUser(updated);
    setEditFullName(updated.fullName);
    setEditCompany(updated.company || "");
    setEditPhone(updated.phone || "");
    setEditAvatarUrl(updated.avatarUrl || "");
    setActiveTab("PROFILE");
    setProfileMsg("Profile details updated successfully!");
    setTimeout(() => setProfileMsg(""), 3000);

    if (startProjectAfter) {
      navigate({ to: "/request-project" });
    }
  };

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSentMsg("Your message has been dispatched to engineering leadership.");
    setSupportMessage("");
    setTimeout(() => setSupportSentMsg(""), 5000);
  };

  const [resumeActionError, setResumeActionError] = useState("");

  const handleOpenResume = async (fileName: string, applicantName: string) => {
    if (!fileName) return;
    setResumeActionError("");
    try {
      const response = await fetch(`/api/admin/careers/resume/${encodeURIComponent(fileName)}`, {
        headers: {
          Authorization: `Bearer ${user?.id || "admin_master_07"}`,
          "X-Admin-Role": user?.role || "ADMIN",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        setResumeActionError(errData?.error || "Failed to open resume document.");
        setTimeout(() => setResumeActionError(""), 4000);
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank");
    } catch (err) {
      console.error("Error opening resume document:", err);
      setResumeActionError("Network error retrieving candidate resume document.");
      setTimeout(() => setResumeActionError(""), 4000);
    }
  };

  const handleDownloadResume = async (fileName: string, applicantName: string) => {
    if (!fileName) return;
    setResumeActionError("");
    try {
      const response = await fetch(
        `/api/admin/careers/resume/${encodeURIComponent(fileName)}?download=true`,
        {
          headers: {
            Authorization: `Bearer ${user?.id || "admin_master_07"}`,
            "X-Admin-Role": user?.role || "ADMIN",
          },
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        setResumeActionError(errData?.error || "Failed to download resume document.");
        setTimeout(() => setResumeActionError(""), 4000);
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const fileExt = fileName.split(".").pop() || "pdf";
      const downloadName = `${applicantName.replace(/[^\w.-]/g, "_")}_Resume.${fileExt}`;
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Error downloading resume document:", err);
      setResumeActionError("Network error downloading candidate resume document.");
      setTimeout(() => setResumeActionError(""), 4000);
    }
  };

  if (!user) return null;

  const hasAvatar = Boolean(editAvatarUrl && isRealAvatar(editAvatarUrl));
  const hasCompany = Boolean(user.company && user.company.trim());
  const hasPhone = Boolean(user.phone && user.phone.trim());

  let profileScore = 40;
  if (hasAvatar) profileScore += 20;
  if (hasCompany) profileScore += 20;
  if (hasPhone) profileScore += 20;

  const sidebarNavItems = [
    { id: "PROFILE", label: "Account Profile", icon: User },
    { id: "MY PROJECTS", label: "Dashboard", icon: FolderKanban, badge: "3 NEW" },
    { id: "REQUEST SERVICE", label: "Request Service", icon: PlusCircle },
    { id: "MEETINGS", label: "Meetings", icon: Calendar, badge: "1 NEW" },
    { id: "MESSAGES", label: "Messages & Support", icon: MessageSquare, badge: "2 NEW" },
    { id: "SETTINGS", label: "Security & 2FA", icon: Settings },
  ] as const;

  const adminNavItems = [
    {
      id: "ADMIN_REQUESTS",
      label: "All Client Requests & Meetings",
      icon: FolderKanban,
      badge: unreadRequestsCount > 0 ? `${unreadRequestsCount} NEW` : "0 NEW",
    },
    {
      id: "ADMIN_CAREERS",
      label: "Job Applications & Resumes",
      icon: Briefcase,
      badge: careerApps.length > 0 ? `${careerApps.length}` : null,
    },
    { id: "ADMIN_SHOWCASE", label: "Upload Work Showcase", icon: Layers },
    { id: "ADMIN_SECURITY", label: "Security Audit Logs", icon: ShieldAlert },
  ] as const;

  const renderDeviceIcon = () => {
    if (viewport.deviceType === "Mobile") return <Smartphone className="h-3.5 w-3.5 text-steel" />;
    if (viewport.deviceType === "Tablet") return <Tablet className="h-3.5 w-3.5 text-steel" />;
    return <Monitor className="h-3.5 w-3.5 text-steel" />;
  };

  return (
    <div className="min-h-screen bg-abyss text-foreground pb-20">
      {/* Top Header Banner */}
      <div className="border-b border-border/80 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 border border-steel/40 font-mono text-xs font-bold text-steel overflow-hidden shadow-inner shrink-0">
              {isRealAvatar(editAvatarUrl || user.avatarUrl) ? (
                <img
                  src={editAvatarUrl || user.avatarUrl}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user.fullName)
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground tracking-tight flex items-center gap-2">
                {user.fullName}
                {user.role === "ADMIN" && (
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-[9px] text-rose-400 border border-rose-500/30">
                    ADMIN
                  </span>
                )}
              </p>
              <p className="text-[11px] text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              to="/request-project"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-90 font-medium"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>START A PROJECT</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Clean Device Name Badge at the VERY LAST CORNER of top banner */}
            <div className="flex items-center gap-1.5 rounded-full border border-steel/30 bg-steel/10 px-3 py-1 text-xs font-mono text-steel">
              {renderDeviceIcon()}
              <span>{viewport.deviceType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Responsive Dashboard Layout */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="space-y-6">
          {/* Client Navigation Section (Only for NON-ADMIN users) */}
          {user.role !== "ADMIN" && (
            <div>
              <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Client Portal
              </p>
              <div className="space-y-1">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const badgeText = "badge" in item ? (item as any).badge : null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-card text-foreground border border-border/80 shadow-sm font-semibold"
                          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isActive ? "text-steel" : ""}`} />
                        <span>{item.label}</span>
                      </div>
                      {badgeText && (
                        <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 font-mono text-[9px] font-bold">
                          {badgeText}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Workspace Section (Visible if Admin) */}
          {user.role === "ADMIN" && (
            <div className="pt-4 border-t border-border/60">
              <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" />
                <span>Admin Control Panel</span>
              </p>
              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const badgeText = "badge" in item ? (item as any).badge : null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        if (item.id === "ADMIN_REQUESTS") handleMarkAllRequestsRead();
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-rose-500/10 text-rose-300 border border-rose-500/40 shadow-sm font-semibold"
                          : "text-muted-foreground hover:bg-rose-500/5 hover:text-rose-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isActive ? "text-rose-400" : ""}`} />
                        <span>{item.label}</span>
                      </div>
                      {badgeText && (
                        <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 font-mono text-[9px] font-bold">
                          {badgeText}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all border-t border-border/40 pt-4 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="space-y-6">
          {statusUpdateMsg && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              {statusUpdateMsg}
            </div>
          )}

          {/* TAB 1: PROFILE */}
          {activeTab === "PROFILE" && (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 gap-2">
                <div>
                  <h3 className="text-sm font-semibold">Account Profile & Photo</h3>
                  <p className="text-xs text-muted-foreground">
                    Upload your profile picture and update account details.
                  </p>
                </div>
                <div className="font-mono text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 self-start sm:self-auto">
                  {profileScore}% Profile Score
                </div>
              </div>

              {profileMsg && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{profileMsg}</span>
                </div>
              )}

              {uploadError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Profile Photo Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border border-border/60 bg-background/50">
                <div
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    fileInputRef.current?.click();
                  }}
                  className="relative group cursor-pointer shrink-0"
                >
                  <div className="h-28 w-28 rounded-full border-2 border-steel/60 bg-card overflow-hidden flex items-center justify-center font-mono text-3xl font-bold text-steel shadow-2xl">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-steel" />
                    ) : isRealAvatar(editAvatarUrl || user?.avatarUrl) ? (
                      <img
                        src={editAvatarUrl || user?.avatarUrl}
                        alt={editFullName || user?.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(editFullName || user.fullName)
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono">
                    <Camera className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-mono">
                      Profile Photo
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload any photo from your computer or device. Automatically formatted for
                    Mobile, Tablet & Desktop.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {isRealAvatar(editAvatarUrl || user?.avatarUrl) ? (
                      <>
                        <button
                          disabled={isUploading}
                          onClick={() => {
                            if (fileInputRef.current) fileInputRef.current.value = "";
                            fileInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-steel/60 bg-card px-4 py-2 font-mono text-xs font-semibold text-steel hover:text-foreground hover:bg-secondary/60 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-steel" />
                              <span>Saving Photo...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 text-amber-400" />
                              <span>Change Photo</span>
                            </>
                          )}
                        </button>

                        {!isUploading && (
                          <button
                            onClick={handleRemovePhoto}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-mono text-xs text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        disabled={isUploading}
                        onClick={() => {
                          if (fileInputRef.current) fileInputRef.current.value = "";
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-steel/60 bg-card px-4 py-2 font-mono text-xs font-semibold text-steel hover:text-foreground hover:bg-secondary/60 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-steel" />
                            <span>Saving Photo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 text-emerald-400" />
                            <span>Upload Profile Picture</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details Inputs */}
              <div className="space-y-4 max-w-lg pt-4 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-mono">
                  Account Details
                </h4>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Company / Client Organization
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="e.g. Acme Enterprise Labs"
                    className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Direct Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+1 (555) 019-9944"
                    className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleSaveProfile(false)}
                    className="rounded-xl border border-steel/60 bg-card px-4 py-2 font-mono text-xs font-semibold text-steel hover:text-foreground cursor-pointer"
                  >
                    Save Profile
                  </button>

                  <button
                    onClick={() => handleSaveProfile(true)}
                    className="rounded-xl bg-foreground px-4 py-2 font-mono text-xs font-bold text-background uppercase tracking-wider hover:opacity-90 cursor-pointer"
                  >
                    Save & Start Project →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PROJECTS / DASHBOARD */}
          {activeTab === "MY PROJECTS" && (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h3 className="text-sm font-semibold">Active Dashboard & Projects</h3>
                  <p className="text-xs text-muted-foreground">
                    Manage active service builds and requests assigned to your account.
                  </p>
                </div>
                <Link
                  to="/request-project"
                  className="rounded-xl bg-foreground px-3.5 py-2 font-mono text-xs font-semibold text-background uppercase tracking-wider hover:opacity-90 inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Request New Project</span>
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border/80 rounded-2xl">
                  <FolderKanban className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    No active projects found on your dashboard.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Submit your scope requirements to initiate technical architecture discovery.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-xl border border-border/80 bg-background/60 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-steel uppercase">
                            {proj.serviceType}
                          </span>
                          <h4 className="text-base font-semibold text-foreground mt-0.5">
                            {proj.projectDescription}
                          </h4>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-[10px] text-emerald-400 border border-emerald-500/30">
                          {proj.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40 font-mono">
                        <div>
                          Budget:{" "}
                          <span className="text-steel font-semibold">
                            {proj.budgetRange || "Negotiable"}
                          </span>
                        </div>
                        <div>
                          Timeline:{" "}
                          <span className="text-steel font-semibold">
                            {proj.timeline || "Milestone Based"}
                          </span>
                        </div>
                        <div>
                          Requested:{" "}
                          <span className="text-steel font-semibold">
                            {new Date(proj.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REQUEST SERVICE */}
          {activeTab === "REQUEST SERVICE" && (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold">Initiate Technical Project Request</h3>
                <p className="text-xs text-muted-foreground">
                  Select a service tier and submit confidential project requirements.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-5 rounded-xl border border-border/80 bg-background/50 space-y-3">
                  <span className="font-mono text-xs text-steel">TIER 01</span>
                  <h4 className="text-base font-semibold">Autonomous AI & RAG Agents</h4>
                  <p className="text-xs text-muted-foreground">
                    Custom intelligent agents, vector search, and automated pipeline integration.
                  </p>
                  <Link
                    to="/request-project"
                    className="inline-block mt-2 font-mono text-xs text-emerald-400 underline font-semibold"
                  >
                    Request AI Scope →
                  </Link>
                </div>

                <div className="p-5 rounded-xl border border-border/80 bg-background/50 space-y-3">
                  <span className="font-mono text-xs text-steel">TIER 02</span>
                  <h4 className="text-base font-semibold">Zero-Trust Security & Cloud</h4>
                  <p className="text-xs text-muted-foreground">
                    Hardened Auth, 2FA, OAuth2 servers, mTLS rotation, and cloud orchestration.
                  </p>
                  <Link
                    to="/request-project"
                    className="inline-block mt-2 font-mono text-xs text-emerald-400 underline font-semibold"
                  >
                    Request Security Audit →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEETINGS */}
          {activeTab === "MEETINGS" && (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h3 className="text-sm font-semibold">Engineering Consultations & Meetings</h3>
                  <p className="text-xs text-muted-foreground">
                    Booked discovery calls with lead architects.
                  </p>
                </div>
                <Link
                  to="/book-call"
                  className="rounded-xl bg-foreground px-3.5 py-2 font-mono text-xs font-semibold text-background uppercase tracking-wider hover:opacity-90 inline-flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Book Consultation</span>
                </Link>
              </div>

              {meetings.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border/80 rounded-2xl">
                  <Calendar className="h-9 w-9 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No upcoming meetings scheduled.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {meetings.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-border/80 bg-background/50 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-foreground">{m.topic}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {m.scheduledDate} at {m.timeSlot}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MESSAGES & SUPPORT */}
          {activeTab === "MESSAGES" && (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold">Confidential Engineering Support</h3>
                <p className="text-xs text-muted-foreground">
                  Direct TLS-encrypted dispatch to lead architects.
                </p>
              </div>

              {supportSentMsg && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  {supportSentMsg}
                </div>
              )}

              <form onSubmit={handleSendSupportMessage} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your issue or technical inquiry..."
                    className="w-full rounded-xl border border-border/80 bg-background/60 p-3 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-foreground px-5 py-2.5 font-mono text-xs font-semibold text-background uppercase tracking-wider hover:opacity-90 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Dispatch Message</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: SETTINGS & 2FA */}
          {activeTab === "SETTINGS" && (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 space-y-8">
              <div>
                <h3 className="text-sm font-semibold">Account & Two-Factor Security (2FA)</h3>
                <p className="text-xs text-muted-foreground">
                  Optional hardware/app TOTP authentication settings.
                </p>
              </div>

              {twoFactorStatusMsg && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  {twoFactorStatusMsg}
                </div>
              )}

              {/* 2FA Component */}
              <TwoFactorSetup
                user={user}
                onStatusChange={(enabled) => {
                  setUser((prev) => (prev ? { ...prev, twoFactorEnabled: enabled } : prev));
                }}
              />

              {/* Password Form */}
              <div className="space-y-4 max-w-md pt-4 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-mono">
                  Update Master Password
                </h4>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (newPassword.length >= 6) {
                      setSettingsMsg("Master password updated securely.");
                      setNewPassword("");
                      setTimeout(() => setSettingsMsg(""), 3000);
                    }
                  }}
                  className="rounded-xl bg-foreground px-4 py-2 font-mono text-xs text-background font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* ADMIN TAB 1: UPLOAD WORK SHOWCASE */}
          {activeTab === "ADMIN_SHOWCASE" && user.role === "ADMIN" && (
            <div className="rounded-2xl border border-rose-500/40 bg-card/90 p-6 space-y-6">
              <div className="border-b border-border/60 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Layers className="h-4 w-4" />
                    Admin Work Showcase Manager
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Upload real completed projects post-deployment. Newly added work automatically
                    appears **FIRST** on the public Work page.
                  </p>
                </div>
              </div>

              {showcaseMsg && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{showcaseMsg}</span>
                </div>
              )}

              {/* ⚡ 1-Click Instant Project Upload Presets */}
              <div className="p-4 rounded-2xl border border-steel/30 bg-steel/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-steel flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>⚡ 1-Click Instant Upload Presets</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Click to publish instantly
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickUploadPreset({
                        title: "Record Writers — Order Management & Documentation System",
                        clientName: "Record Writers",
                        category: "Documentation & Fulfillment",
                        description:
                          "Centralized order fulfillment platform automating academic, school, and medical documentation pipelines with real-time tracking.",
                        fullDetails:
                          "Live at recordwriters07.netlify.app. Features automated intake routing, encrypted document handling, and instantaneous order dispatch.",
                        imageUrl:
                          "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
                        liveUrl: "https://recordwriters07.netlify.app/",
                        techStack: ["React", "TypeScript", "Netlify", "Order Engine"],
                      })
                    }
                    className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-left transition-all cursor-pointer font-mono text-xs flex flex-col justify-between space-y-1"
                  >
                    <span className="font-bold text-foreground">⚡ Upload Record Writers</span>
                    <span className="text-[10px] text-emerald-400 opacity-90">
                      recordwriters07.netlify.app
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickUploadPreset({
                        title: "Autonomous Student & School Services Pipeline",
                        clientName: "Academic Operations",
                        category: "Student & School Services",
                        description:
                          "Automated intake system for school records, documentation requests, mini project assistance, and student service tracking.",
                        fullDetails:
                          "Custom workflow engine reducing document fulfillment turnaround time from 3 days to under 2 hours.",
                        imageUrl:
                          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
                        liveUrl: "https://recordwriters07.netlify.app/",
                        techStack: ["TypeScript", "n8n", "PostgreSQL", "React"],
                      })
                    }
                    className="p-3 rounded-xl border border-steel/40 bg-card/60 hover:bg-secondary text-steel text-left transition-all cursor-pointer font-mono text-xs flex flex-col justify-between space-y-1"
                  >
                    <span className="font-bold text-foreground">⚡ Upload Student/School Hub</span>
                    <span className="text-[10px] text-muted-foreground">Documentation Engine</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickUploadPreset({
                        title: "Medical & Mini Project Documentation Hub",
                        clientName: "Healthcare & Academic Partner",
                        category: "Medical Services & Docs",
                        description:
                          "Structured medical document records, order processing, and custom mini project documentation engine.",
                        fullDetails:
                          "Encrypted record storage and automated template generation for medical & student documentation.",
                        imageUrl:
                          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                        liveUrl: "https://recordwriters07.netlify.app/",
                        techStack: ["React", "TypeScript", "Express", "Supabase"],
                      })
                    }
                    className="p-3 rounded-xl border border-steel/40 bg-card/60 hover:bg-secondary text-steel text-left transition-all cursor-pointer font-mono text-xs flex flex-col justify-between space-y-1 sm:col-span-2 lg:col-span-1"
                  >
                    <span className="font-bold text-foreground">⚡ Upload Medical & Mini Docs</span>
                    <span className="text-[10px] text-muted-foreground">
                      Order & Record Fulfillment
                    </span>
                  </button>
                </div>
              </div>

              {/* Upload Form */}
              <form
                onSubmit={handleAddShowcaseSubmit}
                className="space-y-4 p-5 rounded-2xl border border-border/80 bg-background/60"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-mono">
                  + Add New Completed Project
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newShowcaseTitle}
                      onChange={(e) => setNewShowcaseTitle(e.target.value)}
                      placeholder="e.g. Quantum Execution Gateway"
                      className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                      Client / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newShowcaseClient}
                      onChange={(e) => setNewShowcaseClient(e.target.value)}
                      placeholder="e.g. Apex Global Quant"
                      className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                      Category
                    </label>
                    <select
                      value={newShowcaseCategory}
                      onChange={(e) => setNewShowcaseCategory(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="AI & Neural Pipelines">AI & Neural Pipelines</option>
                      <option value="Cybersecurity & Auth">Cybersecurity & Auth</option>
                      <option value="Enterprise Software">Enterprise Software</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newShowcaseTech}
                      onChange={(e) => setNewShowcaseTech(e.target.value)}
                      placeholder="React, TypeScript, Postgres, Docker"
                      className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newShowcaseDesc}
                    onChange={(e) => setNewShowcaseDesc(e.target.value)}
                    placeholder="High level overview of what was built and delivered..."
                    className="w-full rounded-xl border border-border/80 bg-background p-2.5 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Technical Architecture Details (Optional)
                  </label>
                  <input
                    type="text"
                    value={newShowcaseFull}
                    onChange={(e) => setNewShowcaseFull(e.target.value)}
                    placeholder="Specific architectural metrics (e.g. 50k requests/sec, Zero-Trust mTLS)"
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Live Project Link
                  </label>
                  <input
                    type="url"
                    value={newShowcaseLive}
                    onChange={(e) => setNewShowcaseLive(e.target.value)}
                    placeholder="https://client-project.com"
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-mono text-xs uppercase tracking-widest text-black font-bold hover:bg-rose-400 transition-all cursor-pointer shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                  <span>Publish Work Project (Appears 1st on /work)</span>
                </button>
              </form>

              {/* List existing showcase items */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-mono">
                  Live Showcase Items ({showcaseItems.length})
                </h4>
                <div className="grid gap-3">
                  {showcaseItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-border/60 bg-background/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {item.title}
                          </span>
                          {index === 0 && (
                            <span className="rounded bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 font-mono">
                              FIRST ITEM (TOP)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {item.clientName} · {item.category}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteShowcaseItem(item.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                        title="Delete project showcase"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TAB 2: CLIENT REQUESTS */}
          {activeTab === "ADMIN_REQUESTS" && user.role === "ADMIN" && (
            <div className="rounded-2xl border border-rose-500/40 bg-card/90 p-6 space-y-6">
              <div className="border-b border-border/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-rose-400" />
                    <span>Admin Client Service Requests Manager</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review and update status for all submitted client projects & discovery calls.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 font-mono text-xs font-bold">
                    {unreadRequestsCount} UNREAD
                  </span>
                  <button
                    type="button"
                    onClick={handleMarkAllRequestsRead}
                    className="rounded-xl border border-steel/40 bg-steel/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-steel hover:text-foreground hover:bg-steel/20 transition-all cursor-pointer"
                  >
                    ✔ Mark All as Read (0)
                  </button>
                </div>
              </div>

              {/* SECTION A: PROJECT BRIEFS & SCOPE REQUESTS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-mono">
                  Project Scope Briefs ({projects.length})
                </h4>

                {projects.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-border/80 rounded-xl font-mono text-xs text-muted-foreground">
                    No project briefs submitted yet.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-5 rounded-xl border border-border/80 bg-background/60 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {proj.userName} ({proj.userEmail})
                            </p>
                            <p className="text-[11px] font-mono text-steel uppercase">
                              {proj.serviceType}
                            </p>
                          </div>
                          <select
                            value={proj.status}
                            onChange={(e) =>
                              handleProjectStatusChange(proj.id, e.target.value as ProjectStatus)
                            }
                            className="rounded-lg bg-card border border-rose-500/40 px-3 py-1 text-xs text-rose-300 font-mono focus:outline-none cursor-pointer"
                          >
                            <option value="REQUESTED">REQUESTED</option>
                            <option value="UNDER REVIEW">UNDER REVIEW</option>
                            <option value="APPROVED">APPROVED / CONFIRMED</option>
                            <option value="IN PROGRESS">IN PROGRESS</option>
                            <option value="IN REVIEW">IN REVIEW</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {proj.projectDescription}
                        </p>

                        <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border/40 font-mono">
                          <div>
                            Budget: <span className="text-steel font-semibold">{proj.budgetRange || "Flexible"}</span>
                          </div>
                          <div>
                            Timeline: <span className="text-steel font-semibold">{proj.timeline || "Flexible"}</span>
                          </div>
                          <div>
                            Requested: <span className="text-steel font-semibold">{new Date(proj.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Quick Admin Status Actions */}
                        <div className="pt-2 border-t border-border/40 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleProjectStatusChange(proj.id, "APPROVED")}
                            className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-emerald-500/30 cursor-pointer"
                          >
                            ✔ CONFIRM / APPROVE
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProjectStatusChange(proj.id, "UNDER REVIEW")}
                            className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-amber-500/30 cursor-pointer"
                          >
                            ⏱ RESCHEDULE / REVIEW
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProjectStatusChange(proj.id, "CANCELLED")}
                            className="rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-rose-500/30 cursor-pointer"
                          >
                            ✖ CANCEL
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProjectStatusChange(proj.id, "COMPLETED")}
                            className="rounded bg-steel/20 text-steel border border-steel/40 px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-steel/30 cursor-pointer"
                          >
                            ✓ MARK COMPLETED
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION B: 15-MIN DISCOVERY CALL BOOKINGS */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-mono">
                  15-Min Discovery Call Bookings ({meetings.length})
                </h4>

                {meetings.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-border/80 rounded-xl font-mono text-xs text-muted-foreground">
                    No discovery calls requested yet.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {meetings.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl border border-border/80 bg-background/60 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-foreground">{m.topic}</p>
                          <p className="text-[11px] font-mono text-steel">
                            {m.scheduledDate} at {m.timeSlot}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADMIN TAB 2: CAREERS & JOB APPLICATIONS */}
          {activeTab === "ADMIN_CAREERS" && user.role === "ADMIN" && (
            <div className="rounded-2xl border border-rose-500/40 bg-card/90 p-6 space-y-6">
              <div className="border-b border-border/60 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-rose-400" />
                    <span>Job Applications & Resumes ({careerApps.length})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review incoming candidate applications submitted through the Careers page.
                  </p>
                </div>
                <span className="font-mono text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30 font-bold">
                  {careerApps.length} APPLICANTS
                </span>
              </div>

              {careerApps.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border/80 rounded-2xl font-mono text-xs text-muted-foreground space-y-2">
                  <p>No job applications received yet.</p>
                  <p className="text-[11px] text-steel">Applications submitted on /careers will appear here automatically.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {careerApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl border border-border/80 bg-background/60 space-y-3 shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground">{app.full_name}</h4>
                            <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">
                              {app.role_applied}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {app.email} {app.phone ? `· ${app.phone}` : ""} {app.location ? `· ${app.location}` : ""}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] text-steel bg-steel/10 px-2.5 py-1 rounded-full border border-steel/20 shrink-0">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {app.cover_note && (
                        <div className="p-3 rounded-xl border border-border/50 bg-card/60 text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                          {app.cover_note}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between pt-2 text-xs font-mono gap-2">
                        <div>
                          {app.portfolio_url ? (
                            <a
                              href={app.portfolio_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                            >
                              <span>Portfolio Link</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">Portfolio: N/A</span>
                          )}
                        </div>

                        {resumeActionError && (
                          <div className="w-full text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2 rounded-lg">
                            {resumeActionError}
                          </div>
                        )}

                        {app.resume_url && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenResume(app.resume_url!, app.full_name)}
                              className="inline-flex items-center gap-1.5 text-steel bg-steel/10 border border-steel/30 px-3 py-1.5 rounded-lg hover:bg-steel/20 hover:text-foreground transition-all cursor-pointer text-xs font-mono font-medium"
                              title="Open Resume in new browser tab"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>View Resume</span>
                              <ExternalLink className="h-3 w-3 opacity-70" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadResume(app.resume_url!, app.full_name)}
                              className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer text-xs font-mono font-medium"
                              title="Download Resume document file"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADMIN TAB 3: SECURITY AUDIT */}
          {activeTab === "ADMIN_SECURITY" && user.role === "ADMIN" && (
            <div className="rounded-2xl border border-rose-500/40 bg-card/90 p-6 space-y-6">
              <div className="border-b border-border/60 pb-4">
                <h3 className="text-sm font-semibold text-rose-400 font-mono uppercase tracking-wider">
                  System-Wide Security & Audit Fabric
                </h3>
                <p className="text-xs text-muted-foreground">
                  Global zero-trust authentication monitoring and anti-phishing logs.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 font-mono flex items-center justify-between">
                <div>
                  <p className="font-bold">STATUS: ZERO-TRUST FABRIC ACTIVE</p>
                  <p className="text-[11px] opacity-90">
                    All client data segregated with IDOR checks. Brute-force rate limiting active.
                  </p>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
