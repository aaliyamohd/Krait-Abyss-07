import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { authService, isRealAvatar, type UserProfile } from "@/services/authService";
import { avatarStorageService } from "@/services/avatarStorageService";
import { useDeviceViewport } from "@/hooks/useDeviceViewport";
import { User, LogOut, LayoutDashboard, Monitor, Smartphone, Tablet } from "lucide-react";
import logo from "@/assets/krait-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const navigate = useNavigate();
  const viewport = useDeviceViewport();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncUser = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const persistentAvatar = await avatarStorageService.getAvatar(currentUser.id);
        if (persistentAvatar && isRealAvatar(persistentAvatar)) {
          setUser((prev) => (prev ? { ...prev, avatarUrl: persistentAvatar } : prev));
        }
      } else {
        setUser(null);
      }
    };

    const handleAvatarChange = (e: any) => {
      const { avatarUrl } = e.detail || {};
      if (avatarUrl !== undefined) {
        setUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
      } else {
        syncUser();
      }
    };

    syncUser();
    window.addEventListener("focus", syncUser);
    window.addEventListener("storage", syncUser);
    window.addEventListener("avatar_changed", handleAvatarChange);
    return () => {
      window.removeEventListener("focus", syncUser);
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("avatar_changed", handleAvatarChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAccountMenuOpen(false);
    navigate({ to: "/login" });
  };

  const renderDeviceIcon = () => {
    if (viewport.deviceType === "Mobile") return <Smartphone className="h-3.5 w-3.5 text-steel" />;
    if (viewport.deviceType === "Tablet") return <Tablet className="h-3.5 w-3.5 text-steel" />;
    return <Monitor className="h-3.5 w-3.5 text-steel" />;
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-abyss/90 backdrop-blur-xl"
          : "border-border/50 bg-abyss/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Krait Abyss logo"
            className="h-9 w-9 rounded-md object-contain p-1 border border-border/80 bg-black shadow-sm"
          />
          <span className="flex flex-col leading-none">
            <span className="font-mono text-sm tracking-[0.28em] text-steel">KRAIT</span>
            <span className="font-mono text-[0.55rem] tracking-[0.42em] text-muted-foreground">
              ABYSS
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground font-semibold" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Navigation"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/80 text-steel transition-colors hover:bg-card hover:text-foreground cursor-pointer"
          >
            <span className="sr-only">Toggle Menu</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="border-t border-border/80 bg-abyss/95 backdrop-blur-2xl lg:hidden p-5 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 font-mono text-xs uppercase tracking-wider">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
