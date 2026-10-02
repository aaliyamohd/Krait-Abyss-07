import { motion } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Activity } from "lucide-react";

interface ContactRobotVisualProps {
  className?: string;
  variant?: "homepage" | "contact";
}

export function ContactRobotVisual({ className = "", variant = "contact" }: ContactRobotVisualProps) {
  const isHomepage = variant === "homepage";

  // Reusable 3D Stage with smooth device-adaptive scaling
  const renderRobotStage = (scaleClasses: string, maxHClass: string) => (
    <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-1">
      <div className={`w-full h-full ${maxHClass} flex items-center justify-center relative overflow-hidden rounded-xl`}>
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className={`w-full h-full ${scaleClasses} transition-transform duration-300`}
        />
      </div>
    </div>
  );

  // Homepage: Frameless 3D Robot with white patch spotlight glow
  if (isHomepage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 1.15, y: -20 }}
        animate={{ opacity: 1, scale: 1.0, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.05,
        }}
        className={`relative w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[520px] flex flex-col justify-center items-center overflow-hidden pointer-events-auto border-none bg-transparent shadow-none p-0 ${className}`}
      >
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
          size={420}
        />
        {renderRobotStage("scale-100 sm:scale-105 md:scale-115 lg:scale-120", "max-h-[300px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[500px]")}
      </motion.div>
    );
  }

  // Contact Page: Structured technical card panel with header & footer
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`surface-panel relative w-full h-[360px] sm:h-[400px] md:h-[440px] overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between p-4 ${className}`}
    >
      {/* Technical Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 z-20 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-steel animate-pulse" />
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-steel font-semibold uppercase">
            INTERACTIVE 3D CORE
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-steel">
          <span className="h-1.5 w-1.5 rounded-full bg-steel animate-pulse" />
          <span className="font-semibold tracking-wider uppercase">Spline 3D</span>
        </div>
      </div>

      {/* Main 3D Stage */}
      {renderRobotStage("scale-100 sm:scale-105 md:scale-110", "max-h-[320px] sm:max-h-[350px]")}

      {/* Technical Footer */}
      <div className="border-t border-border/60 pt-2 flex items-center justify-between font-mono text-[0.6rem] text-muted-foreground z-20 select-none">
        <span className="text-steel tracking-wider uppercase">SYSTEM STATE</span>
        <span className="flex items-center gap-1.5 text-steel font-semibold uppercase tracking-wider">
          <Activity className="h-3 w-3 text-steel" /> ACTIVE
        </span>
      </div>
    </motion.div>
  );
}
