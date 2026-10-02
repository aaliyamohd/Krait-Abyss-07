import { useEffect, useRef } from "react";

interface CareersEnergyVisualProps {
  className?: string;
}

/**
 * Careers Page Ultra-Dense 96-Strand Criss-Cross Silk Line Visualizer
 * Features:
 * - 96 Ultra-dense razor-sharp silk vector strands with NO empty gaps between root anchors.
 * - 100% Complete Edge-to-Edge Roots: Top roots span [0, width], Bottom roots span [0, width].
 * - Opposing helical phases creating a rich, dense CRISS-CROSS SILK LATTICE & wave intersections.
 * - Up-to-down cascading liquid wave flow (NO rotational spinning).
 * - 100% Transparent background with DPR 3.0 vector precision.
 */
export function CareersEnergyVisual({ className = "" }: CareersEnergyVisualProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    // 128 Ultra-Dense Razor-Sharp Organic Silk Vector Strands
    const strandCount = 128;
    const strands = Array.from({ length: strandCount }, (_, i) => {
      const normIndex = i / (strandCount - 1); // 0 (left edge) to 1 (right edge)
      const angle = normIndex * Math.PI * 2;
      const direction = i % 2 === 0 ? 1 : -1; // Opposing twist directions for criss-cross lattice
      return {
        normIndex,
        angle,
        direction,
        speed: 0.55 + (i % 5) * 0.05, // Medium-slow top-to-bottom liquid wave speed
        phase: (i * Math.PI * 2) / strandCount,
        width: 0.38 + (i % 3) * 0.24, // Crisp fine silk line stroke width (0.38px - 0.62px)
        alpha: 0.45 + (i % 3) * 0.18,
        isCoreBright: i % 4 === 0,
        cornerX: normIndex, // 0 at left edge, 1 at right edge
      };
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetMouseX = (x / rect.width - 0.5) * 30;
      targetMouseY = (y / rect.height - 0.5) * 30;
    };

    const handlePointerLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    let isVisible = true;
    const visObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry) isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visObserver.observe(container);

    let animId = 0;
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      // Medium-slow balanced time progression (not very fast, not very slow)
      time += 0.009;

      // Smooth pointer lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // 100% Clean Canvas Clear
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5 + mouseX * 0.2;

      // Glassmorphic Ambient Sheen Glow behind central neck
      const glassGlow = ctx.createRadialGradient(cx, height * 0.5, 5, cx, height * 0.5, width * 0.45);
      glassGlow.addColorStop(0, "rgba(255, 255, 255, 0.04)");
      glassGlow.addColorStop(0.5, "rgba(200, 220, 240, 0.015)");
      glassGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glassGlow;
      ctx.fillRect(0, 0, width, height);

      // Up-to-Down trajectory: 100% CONSTANT Edge-to-Edge Roots + Wave Motion Generating Root to Root
      const getSilkTrajectory = (st: typeof strands[0], t: number) => {
        const y = t * height;

        // 100% CONSTANT, FIXED Root Targets at top (t=0) and bottom (t=1.0) spanning [0, width]
        const constantRootX = st!.cornerX * width;

        // Symmetrical Root Flare Envelope: Exactly 0 at t=0 and t=1.0 (Fixed Stationary Anchors)
        let neckFactor = 0;
        if (t < 0.22) {
          neckFactor = Math.pow(Math.sin((t / 0.22) * (Math.PI * 0.5)), 1.3);
        } else if (t > 0.78) {
          neckFactor = Math.pow(Math.sin(((1.0 - t) / 0.22) * (Math.PI * 0.5)), 1.3);
        } else {
          neckFactor = 1.0;
        }

        // Slim central silk neck width (~28px - 34px)
        const slimNeckWidth = Math.max(28, width * 0.12);

        // Organic root branch curve (modulating to ZERO at exact root borders t=0 & t=1.0)
        const borderFade = Math.sin(Math.PI * t);
        const rootBranchCurve = Math.sin(t * Math.PI * 3.6 + st!.phase) * (20 * (1 - neckFactor) * borderFade);

        // ROTARY 3D SPIN: Smooth helical spin along central vertical axis
        const rotarySpin = time * 0.35 * st!.direction;

        // WAVE MOTION GENERATING FROM ROOT TO ROOT: Traveling liquid wave along vector line geometry
        const waveTravelPhase = (t * Math.PI * 8.0 - time * st!.speed * 2.8 + rotarySpin) * st!.direction + st!.phase;
        const twistX = Math.sin(st!.angle * st!.direction + waveTravelPhase) * slimNeckWidth * 0.5;

        // Organic wave ripple modulated by neckFactor (0 at constant root borders, active along length)
        const lineWaveRipple = Math.sin(time * 1.5 - t * Math.PI * 7.0 + st!.phase * 2.0) * (14 * neckFactor);

        const centerSilkX = cx + twistX + lineWaveRipple;
        const edgeRootX = constantRootX + rootBranchCurve;

        // Blend: At t=0 & t=1.0, neckFactor = 0 => x = constantRootX (100% CONSTANT STATIONARY ROOT!)
        const blend = neckFactor * 0.94;
        const x = edgeRootX * (1 - blend) + centerSilkX * blend;

        return { x, y };
      };

      const steps = 110;

      ctx.globalCompositeOperation = "lighter";

      // 1. Render 24 Soft Silk Fabric Depth Veils (Soft background silk cloth undulation)
      const veilCount = 24;
      for (let v = 0; v < veilCount; v++) {
        const idxA = Math.floor((v / veilCount) * (strands.length - 1));
        const idxB = Math.min(strands.length - 1, idxA + 5);
        const stA = strands[idxA]!;
        const stB = strands[idxB]!;

        ctx.beginPath();
        for (let s = 0; s <= steps; s += 2) {
          const t = s / steps;
          const { x, y } = getSilkTrajectory(stA, t);
          const veilWaveShift = Math.sin(time * 1.6 + t * Math.PI * 4.0 + v * 0.3) * 3.0;
          if (s === 0) ctx.moveTo(x + veilWaveShift, y);
          else ctx.lineTo(x + veilWaveShift, y);
        }
        for (let s = steps; s >= 0; s -= 2) {
          const t = s / steps;
          const { x, y } = getSilkTrajectory(stB, t);
          const veilWaveShift = Math.sin(time * 1.6 + t * Math.PI * 4.0 + v * 0.3) * 3.0;
          ctx.lineTo(x + veilWaveShift, y);
        }
        ctx.closePath();

        const veilAlpha = 0.016 + Math.sin(time * 1.2 + v * 0.4) * 0.006;
        ctx.fillStyle = `rgba(215, 230, 250, ${veilAlpha})`;
        ctx.fill();
      }

      // 2. Render 128 Razor-Sharp Organic Silk Vector Lines (Pure Root-to-Root Wavy Motion)
      for (let i = 0; i < strands.length; i++) {
        const st = strands[i]!;

        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const { x, y } = getSilkTrajectory(st, t);

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const alpha = Math.min(1.0, st.alpha * (0.8 + Math.sin(time * 1.2 + st.phase) * 0.2));

        if (st.isCoreBright) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.lineWidth = st.width * 1.15;
        } else {
          ctx.strokeStyle = `rgba(210, 225, 240, ${alpha * 0.6})`;
          ctx.lineWidth = st.width * 0.85;
        }
        ctx.stroke();
      }

      // Glassmorphic Specular Edge Lines at Top and Bottom
      const topGrad = ctx.createLinearGradient(0, 0, width, 0);
      topGrad.addColorStop(0, "rgba(255,255,255,0)");
      topGrad.addColorStop(0.5, "rgba(255,255,255,0.25)");
      topGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = topGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0.5);
      ctx.lineTo(width, 0.5);
      ctx.moveTo(0, height - 0.5);
      ctx.lineTo(width, height - 0.5);
      ctx.stroke();

      ctx.globalCompositeOperation = "source-over";
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      visObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-transparent ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />
    </div>
  );
}
