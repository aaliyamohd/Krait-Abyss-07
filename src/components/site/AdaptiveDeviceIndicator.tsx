import { useDeviceViewport } from "@/hooks/useDeviceViewport";
import { Monitor, Smartphone, Tablet } from "lucide-react";

export function AdaptiveDeviceIndicator() {
  const viewport = useDeviceViewport();

  const renderIcon = () => {
    if (viewport.deviceType === "Mobile") return <Smartphone className="h-4 w-4 text-steel" />;
    if (viewport.deviceType === "Tablet") return <Tablet className="h-4 w-4 text-steel" />;
    return <Monitor className="h-4 w-4 text-steel" />;
  };

  return (
    <div
      title={`Adaptive View: ${viewport.deviceType}`}
      className="fixed bottom-4 left-4 z-40 flex items-center justify-center h-9 w-9 rounded-full border border-border/80 bg-black/85 backdrop-blur-md shadow-xl pointer-events-none select-none transition-transform hover:scale-105"
    >
      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
      {renderIcon()}
    </div>
  );
}
