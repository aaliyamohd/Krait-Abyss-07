import { useEffect, useRef } from "react";

interface NeuralNetworkLinesProps {
  className?: string;
}

/**
 * Ultra-Clear 3D Symmetrical Neural Network Sphere for Homepage.
 * Features:
 * - 100% Crisp vector line resolution (DPR 3.0, zero blur filters or cloudy radial gradients).
 * - Fibonacci Golden-Ratio 3D Spherical Lattice (68 outer, 46 mid, 24 inner core nodes).
 * - Razor-sharp white and silver synapse lines.
 * - Magnetic Pointer Pull & Interactive Click Shockwave Ripples.
 * - Inertial 3D Rotation with physics momentum tracking.
 */
export function NeuralNetworkLines({ className = "" }: NeuralNetworkLinesProps) {
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

      const dpr = Math.min(window.devicePixelRatio || 1, 3.0);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    // --- Generate 100% Symmetrical Fibonacci 3D Neural Mesh ---
    const nodes: {
      x: number;
      y: number;
      z: number;
      baseR: number;
      phase: number;
      isCore: boolean;
    }[] = [];

    // 1. Outer Spherical Lattice (68 nodes at radius = 0.96)
    const outerCount = 68;
    for (let i = 0; i < outerCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / outerCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 0.96;

      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        baseR: 2.2 + (i % 3) * 0.4,
        phase: i * 0.2,
        isCore: false,
      });
    }

    // 2. Mid Spherical Lattice (46 nodes at radius = 0.62)
    const midCount = 46;
    for (let i = 0; i < midCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / midCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + 0.5;
      const radius = 0.62;

      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        baseR: 2.0 + (i % 2) * 0.4,
        phase: i * 0.25,
        isCore: false,
      });
    }

    // 3. Inner Core Lattice (24 nodes at radius = 0.34)
    const innerCount = 24;
    for (let i = 0; i < innerCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / innerCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + 1.0;
      const radius = 0.34;

      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        baseR: 2.4,
        phase: i * 0.3,
        isCore: true,
      });
    }

    // Click Shockwave Ripples
    const shockwaves: { r: number; maxR: number; alpha: number; speed: number }[] = [];

    // Pointer Interaction State
    let mouseX = -9999;
    let mouseY = -9999;
    let isHovered = false;

    let rotX = 0;
    let rotY = 0;
    let velX = 0;
    let velY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (px >= 0 && px <= rect.width && py >= 0 && py <= rect.height) {
        isHovered = true;
        mouseX = px;
        mouseY = py;

        if (lastMouseX !== 0 && lastMouseY !== 0) {
          velY += (px - lastMouseX) * 0.0003;
          velX += (py - lastMouseY) * 0.0003;
        }
        lastMouseX = px;
        lastMouseY = py;
      } else {
        isHovered = false;
        mouseX = -9999;
        mouseY = -9999;
      }
    };

    const handlePointerLeave = () => {
      isHovered = false;
      mouseX = -9999;
      mouseY = -9999;
      lastMouseX = 0;
      lastMouseY = 0;
    };

    const handleClick = () => {
      const orbRadius = Math.min(width, height) * 0.42;
      shockwaves.push({
        r: 10,
        maxR: orbRadius * 1.2,
        alpha: 0.9,
        speed: orbRadius * 0.025,
      });
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);
    container.addEventListener("click", handleClick);

    let animationId = 0;

    // --- Main Ultra-Clear 3D Render Loop ---
    const render = () => {
      const time = performance.now() * 0.001;

      // Physics rotation momentum & friction
      rotY += velY + 0.0035; // Baseline rotation float
      rotX += velX + Math.sin(time * 0.4) * 0.0004;

      velX *= 0.94;
      velY *= 0.94;

      // Completely clear canvas - NO blurry background gradients
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const orbRadius = Math.min(width, height) * 0.42;

      // Project 3D Spherical Nodes with Pointer Attraction
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected: {
        x: number;
        y: number;
        z: number;
        opacity: number;
        r: number;
        isCore: boolean;
        isHoveredNear: boolean;
        hoverIntensity: number;
      }[] = [];

      const interactRadius = 140;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!;

        // Rotate Y & X
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;
        const y1 = node.y;

        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        // Organic subtle breathing wave
        const wave = Math.sin(time * 2.0 + node.phase) * 0.025;
        let screenX = cx + x2 * orbRadius * (1 + wave);
        let screenY = cy + y2 * orbRadius * (1 + wave);

        // Pointer Magnetic Pull
        let hoverIntensity = 0;
        let isHoveredNear = false;

        if (isHovered) {
          const dx = screenX - mouseX;
          const dy = screenY - mouseY;
          const distToMouse = Math.hypot(dx, dy);

          if (distToMouse < interactRadius) {
            isHoveredNear = true;
            hoverIntensity = 1 - distToMouse / interactRadius;

            const pullForce = hoverIntensity * 12 * (z2 + 1.2);
            screenX -= (dx / (distToMouse || 1)) * pullForce;
            screenY -= (dy / (distToMouse || 1)) * pullForce;
          }
        }

        const scale = 1.0 + z2 * 0.3 + hoverIntensity * 0.35;
        const depthOpacity = Math.max(0.4, Math.min(1.0, (z2 + 1.25) / 2.25));

        projected.push({
          x: screenX,
          y: screenY,
          z: z2,
          opacity: depthOpacity,
          r: node.baseR * scale,
          isCore: node.isCore,
          isHoveredNear,
          hoverIntensity,
        });
      }

      // Sort by Z for realistic 3D depth layering
      projected.sort((a, b) => a.z - b.z);

      // Draw Razor-Sharp 3D Synapse Lines
      const maxConnDist = orbRadius * 0.58;

      for (let i = 0; i < projected.length; i++) {
        const na = projected[i]!;
        if (na.opacity < 0.3) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const nb = projected[j]!;
          if (nb.opacity < 0.3) continue;

          const dx = na.x - nb.x;
          const dy = na.y - nb.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnDist) {
            const baseAlpha = (1 - dist / maxConnDist) * 0.7 * Math.min(na.opacity, nb.opacity);

            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);

            if (na.isCore || nb.isCore) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${baseAlpha * 1.3})`;
              ctx.lineWidth = 1.4;
            } else {
              ctx.strokeStyle = `rgba(226, 232, 240, ${baseAlpha})`;
              ctx.lineWidth = 1.2;
            }

            ctx.stroke();
          }
        }
      }

      // Render Active Click Shockwave Ripples
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s]!;
        sw.r += sw.speed;
        sw.alpha -= 0.02;

        if (sw.alpha <= 0 || sw.r >= sw.maxR) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, sw.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Razor-Sharp White Neural Nodes
      for (const p of projected) {
        const alpha = Math.min(1.0, p.opacity + p.hoverIntensity * 0.4);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.6, p.r), 0, Math.PI * 2);
        ctx.fill();
      }

      // Clear Outer Bounding Orbit Ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
      container.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-pointer bg-transparent border-none shadow-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full pointer-events-none touch-none select-none bg-transparent"
        aria-label="Interactive 3D Neural Network Sphere"
      />
    </div>
  );
}
