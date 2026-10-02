import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import kraitLogo from "@/assets/krait-logo.png";

/**
 * Premium Robotic / Mechanical Opening Intro for Krait Abyss.
 *
 * 1. Pitch-Black Void Background (#000000).
 * 2. Original untouched Krait Abyss logo emblem (krait-logo.png).
 * 3. Begins as complete centered logo in middle of screen.
 * 4. Emblem halves mechanically separate & open outward cleanly from center.
 * 5. Reveals centered "KRAIT ABYSS" high-tech text.
 * 6. Concise 1.5 - 2.5s duration with clean fade to homepage.
 * 7. Respects prefers-reduced-motion and plays ONLY on fresh load / manual reload.
 */
export function HomepageIntroOverlay() {
  const [stage, setStage] = useState<"init" | "appear" | "open" | "fadeout" | "done">("init");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setStage("done");
      sessionStorage.setItem("krait_has_visited_site", "true");
      return;
    }

    const navEntries =
      typeof performance !== "undefined"
        ? (performance.getEntriesByType("navigation") as PerformanceNavigationTiming[])
        : [];
    const isReload = navEntries.length > 0 && navEntries[0]?.type === "reload";
    const hasVisited = sessionStorage.getItem("krait_has_visited_site") === "true";

    if (hasVisited && !isReload) {
      setStage("done");
      return;
    }

    sessionStorage.setItem("krait_has_visited_site", "true");
    document.body.style.overflow = "hidden";

    // Smooth, deliberate intro timeline (~4.5s total)
    const t1 = setTimeout(() => setStage("appear"), 50); // 0.05s: Void initialized, emblem centered
    const t2 = setTimeout(() => setStage("open"), 700); // 0.70s: Mechanical opening outward, revealing brand text
    const t3 = setTimeout(() => setStage("fadeout"), 3800); // 3.80s: Gives user ~3.1 seconds of clear reading time
    const t4 = setTimeout(() => {
      setStage("done");
      document.body.style.overflow = "";
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = "";
    };
  }, []);

  if (stage === "done") return null;

  const isOpening = stage === "open" || stage === "fadeout";

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black select-none pointer-events-auto transition-opacity duration-500 ease-out ${
        stage === "fadeout" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Central Viewport Container */}
      <div className="relative flex flex-col items-center justify-center w-[320px] sm:w-[420px] md:w-[540px]">
        {/* Emblem Layer Container */}
        <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] flex items-center justify-center mx-auto my-auto">
          {/* Centered Revealed Text "KRAIT ABYSS" & "INTELLIGENT SYSTEMS" */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-0 text-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{
              opacity: isOpening ? 1 : 0,
              scale: isOpening ? 1 : 0.88,
            }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.35em] pl-[0.35em] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              KRAIT ABYSS
            </span>
            <span className="font-mono text-[0.65rem] sm:text-[0.7rem] md:text-xs font-normal tracking-[0.4em] pl-[0.4em] text-steel/80 uppercase mt-2">
              INTELLIGENT SYSTEMS
            </span>
          </motion.div>

          {/* Left Mechanical Logo Panel (Opens left) */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
            initial={{ x: 0, opacity: 0, scale: 0.85 }}
            animate={{
              x: isOpening ? -130 : 0,
              opacity: stage === "init" ? 0 : 1,
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 85,
              damping: 17,
              mass: 0.8,
            }}
          >
            <img
              src={kraitLogo}
              alt="Krait Abyss Logo Emblem Left"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Right Mechanical Logo Panel (Opens right) */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
            style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
            initial={{ x: 0, opacity: 0, scale: 0.85 }}
            animate={{
              x: isOpening ? 130 : 0,
              opacity: stage === "init" ? 0 : 1,
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 85,
              damping: 17,
              mass: 0.8,
            }}
          >
            <img
              src={kraitLogo}
              alt="Krait Abyss Logo Emblem Right"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
