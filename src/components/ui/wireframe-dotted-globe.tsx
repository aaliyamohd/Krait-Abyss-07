"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { LAND_GEOJSON } from "@/data/landGeoJson";

interface RotatingEarthProps {
  className?: string;
}

export default function RotatingEarth({ className = "" }: RotatingEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animTimer: d3.Timer | null = null;
    const landFeatures = LAND_GEOJSON;
    const allDots: Array<{ lng: number; lat: number }> = [];

    let containerWidth = container.clientWidth || 400;
    let containerHeight = container.clientHeight || 450;
    let radius = Math.min(containerWidth, containerHeight) / 2.45;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      containerWidth = rect.width;
      containerHeight = rect.height;
      radius = Math.min(containerWidth, containerHeight) / 2.45;

      canvas.width = Math.floor(containerWidth * dpr);
      canvas.height = Math.floor(containerHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection
        .scale(radius)
        .translate([containerWidth / 2, containerHeight / 2]);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const pi = polygon[i];
        const pj = polygon[j];
        if (!pi || !pj) continue;
        const [xi, yi] = pi;
        const [xj, yj] = pj;
        if (xi === undefined || yi === undefined || xj === undefined || yj === undefined) continue;

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
        return false;
      }

      return false;
    };

    const generateDotsInPolygon = (feature: any, dotSpacing = 14) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }

      return dots;
    };

    // Pre-calculate dots synchronously from local dataset (0ms latency!)
    landFeatures.features.forEach((feature: any) => {
      const dots = generateDotsInPolygon(feature, 14);
      dots.forEach(([lng, lat]) => {
        allDots.push({ lng, lat });
      });
    });

    // Interaction State
    let mouseX = -9999;
    let mouseY = -9999;
    let isMouseHovered = false;

    let targetRotX = 0;
    let targetRotY = -15;
    let currentRotX = 0;
    let currentRotY = -15;
    let autoRotateSpeed = 0.45;
    let autoRotate = true;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / Math.max(radius, 1);
      const cx = containerWidth / 2;
      const cy = containerHeight / 2;

      // Globe Base (Charcoal Dark with Crisp Silver Perimeter Outline)
      context.beginPath();
      context.arc(cx, cy, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#05070a";
      context.fill();
      context.strokeStyle = "rgba(255, 255, 255, 0.4)";
      context.lineWidth = 1.5 * scaleFactor;
      context.stroke();

      // Graticule Lines (20% opacity)
      const graticule = d3.geoGraticule();
      context.beginPath();
      path(graticule());
      context.strokeStyle = "#ffffff";
      context.lineWidth = 0.8 * scaleFactor;
      context.globalAlpha = 0.2;
      context.stroke();
      context.globalAlpha = 1;

      // Continent Outlines (High-contrast razor-sharp vector path)
      context.beginPath();
      landFeatures.features.forEach((feature: any) => {
        path(feature);
      });
      context.strokeStyle = "rgba(255, 255, 255, 0.95)";
      context.lineWidth = 1.35 * scaleFactor;
      context.stroke();

      // Halftone Continent Dots (Crisp 100% white vector dots)
      const hoverRadiusThreshold = 90;

      for (let i = 0; i < allDots.length; i++) {
        const dot = allDots[i]!;
        const projected = projection([dot.lng, dot.lat]);

        if (
          projected &&
          projected[0] >= 0 &&
          projected[0] <= containerWidth &&
          projected[1] >= 0 &&
          projected[1] <= containerHeight
        ) {
          const dotX = projected[0];
          const dotY = projected[1];
          const dotRadius = 1.35 * scaleFactor;
          const dotAlpha = 0.95;

          context.beginPath();
          context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
          context.fillStyle = `rgba(255, 255, 255, ${dotAlpha})`;
          context.fill();
        }
      }
    };

    // Physics Animation Loop
    const rotate = () => {
      if (autoRotate) {
        targetRotX += autoRotateSpeed;
      }

      currentRotX += (targetRotX - currentRotX) * 0.15;
      currentRotY += (targetRotY - currentRotY) * 0.15;

      projection.rotate([currentRotX, currentRotY]);
      render();
    };

    animTimer = d3.timer(rotate);
    render();

    // Cursor Interaction Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      isMouseHovered = true;
      mouseX = px;
      mouseY = py;

      if (!autoRotate) return;

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const offX = (px - cx) / (cx || 1);
      const offY = (py - cy) / (cy || 1);

      targetRotY = Math.max(-60, Math.min(60, -15 - offY * 25));
      targetRotX += offX * 0.35;
    };

    const handleMouseLeave = () => {
      isMouseHovered = false;
      mouseX = -9999;
      mouseY = -9999;
      targetRotY = -15;
    };

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotX = targetRotX;
      const startRotY = targetRotY;

      const handleDragMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        targetRotX = startRotX + dx * sensitivity;
        targetRotY = Math.max(-85, Math.min(85, startRotY - dy * sensitivity));
      };

      const handleDragEnd = () => {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
        setTimeout(() => {
          autoRotate = true;
        }, 50);
      };

      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      if (animTimer) animTimer.stop();
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[320px] flex items-center justify-center overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full select-none cursor-grab active:cursor-grabbing rounded-2xl"
      />
    </div>
  );
}