import { useState, useEffect } from "react";

export type DeviceCategory = "Mobile" | "Tablet" | "Desktop";

export interface DeviceViewportInfo {
  width: number;
  height: number;
  deviceType: DeviceCategory;
  pixelRatio: number;
  orientation: "Portrait" | "Landscape";
  aspectRatio: string;
}

export function useDeviceViewport(): DeviceViewportInfo {
  const [viewport, setViewport] = useState<DeviceViewportInfo>(() => {
    if (typeof window === "undefined") {
      return {
        width: 1280,
        height: 800,
        deviceType: "Desktop",
        pixelRatio: 1,
        orientation: "Landscape",
        aspectRatio: "16:10",
      };
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const deviceType: DeviceCategory = w < 640 ? "Mobile" : w < 1024 ? "Tablet" : "Desktop";
    const orientation = w >= h ? "Landscape" : "Portrait";
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(w, h);
    const aspect = `${Math.round(w / divisor)}:${Math.round(h / divisor)}`;

    return {
      width: w,
      height: h,
      deviceType,
      pixelRatio: window.devicePixelRatio || 1,
      orientation,
      aspectRatio: aspect,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const deviceType: DeviceCategory = w < 640 ? "Mobile" : w < 1024 ? "Tablet" : "Desktop";
      const orientation = w >= h ? "Landscape" : "Portrait";
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(w, h);
      const aspect = `${Math.round(w / divisor)}:${Math.round(h / divisor)}`;

      setViewport({
        width: w,
        height: h,
        deviceType,
        pixelRatio: window.devicePixelRatio || 1,
        orientation,
        aspectRatio: aspect,
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return viewport;
}
