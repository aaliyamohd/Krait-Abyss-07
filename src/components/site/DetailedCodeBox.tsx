import { useState } from "react";
import {
  Terminal,
  Copy,
  Check,
  Code2,
  FileCode,
  ShieldCheck,
  FolderTree,
  Search,
  GitBranch,
  Play,
  Settings,
} from "lucide-react";

export function DetailedCodeBox({ className = "" }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "agent" | "security" | "terminal">("pipeline");
  const [copied, setCopied] = useState(false);
  const [terminalLogs] = useState<string[]>([
    "krait-core@prod:~$ npx krait-engine stream --active",
    "[SYS] Engine v4.2.0 initialized on port 8080 (14ms latency)",
    "[AI] 128 autonomous agents connected | Vector memory: 1536d",
    "✓ Live Production Stream OK",
  ]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`surface-panel relative w-full overflow-hidden rounded-2xl border border-border/80 bg-[#090b10]/95 shadow-2xl backdrop-blur-xl flex flex-col select-none ${className}`}
    >
      {/* ── VS CODE TOP TITLE BAR ────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border/60 bg-[#0b0e14] px-4 py-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-steel inline-block" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground/90 flex items-center gap-2 border-l border-border/40 pl-3">
            <Code2 className="h-3.5 w-3.5 text-steel" />
            <span className="font-medium">VS Code — krait-abyss-studio</span>
          </span>
        </div>

        {/* IDE RIGHT QUICK TOOLBAR */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-steel font-semibold flex items-center gap-1.5 bg-steel/10 border border-steel/30 px-2.5 py-0.5 rounded-full text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-steel animate-pulse" />
            LIVE EXECUTION
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-steel p-1 rounded-md border border-border/40 bg-card/60 transition-colors ml-1"
            title="Copy Code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-steel" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* ── MAIN VS CODE BODY: LEFT SIDEBAR + TABS & EDITOR PANEL ─────── */}
      <div className="flex flex-1 min-h-[220px]">
        {/* 1. VS CODE LEFT ACTIVITY BAR */}
        <div className="hidden sm:flex flex-col items-center justify-between border-r border-border/50 bg-[#07090e] py-2.5 px-2 text-muted-foreground shrink-0">
          <div className="space-y-3">
            <button
              type="button"
              className="p-1 rounded-md hover:bg-card hover:text-steel transition-colors text-steel"
              title="Explorer"
            >
              <FolderTree className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="p-1 rounded-md hover:bg-card hover:text-steel transition-colors"
              title="Search"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="p-1 rounded-md hover:bg-card hover:text-steel transition-colors"
              title="Source Control"
            >
              <GitBranch className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="p-1 rounded-md hover:bg-card hover:text-steel transition-colors"
              title="Run & Debug"
            >
              <Play className="h-3.5 w-3.5 text-emerald-400" />
            </button>
          </div>
          <div>
            <button
              type="button"
              className="p-1 rounded-md hover:bg-card hover:text-steel transition-colors"
              title="Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 2. EDITOR MAIN AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#090b10]">
          {/* VS CODE TABS BAR */}
          <div className="flex items-center gap-1 border-b border-border/50 bg-[#07090e] px-2 pt-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md font-mono text-[11px] transition-all border-t-2 ${
                activeTab === "pipeline"
                  ? "bg-[#090b10] text-sky-300 border-sky-400 font-semibold"
                  : "bg-transparent text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              <FileCode className="h-3 w-3 text-sky-400" />
              <span>pipeline.ts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("agent")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md font-mono text-[11px] transition-all border-t-2 ${
                activeTab === "agent"
                  ? "bg-[#090b10] text-amber-300 border-amber-400 font-semibold"
                  : "bg-transparent text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              <Code2 className="h-3 w-3 text-amber-400" />
              <span>agent.config.ts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md font-mono text-[11px] transition-all border-t-2 ${
                activeTab === "security"
                  ? "bg-[#090b10] text-emerald-300 border-emerald-400 font-semibold"
                  : "bg-transparent text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>auth.env.ts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("terminal")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md font-mono text-[11px] transition-all border-t-2 ${
                activeTab === "terminal"
                  ? "bg-[#090b10] text-steel border-steel font-semibold"
                  : "bg-transparent text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              <Terminal className="h-3 w-3 text-steel" />
              <span>terminal</span>
            </button>
          </div>

          {/* CODE EDITOR TEXT AREA WITH LINE NUMBERS (SLEEK & BROAD LANDSCAPE FORMAT) */}
          <div className="p-3 sm:p-4 font-mono text-xs overflow-x-auto leading-relaxed text-slate-300">
            {activeTab === "pipeline" && (
              <div className="grid grid-cols-[24px_1fr] gap-2.5">
                {/* Line numbers */}
                <div className="text-slate-600 select-none text-right font-mono text-[11px] space-y-0.5">
                  <div>01</div>
                  <div>02</div>
                  <div>03</div>
                  <div>04</div>
                  <div>05</div>
                </div>

                {/* Code syntax */}
                <div className="space-y-0.5">
                  <p className="text-slate-500">// 1. Initialize Krait Neural Pipeline Engine</p>
                  <p>
                    <span className="text-steel font-medium">import</span> &#123; <span className="text-slate-200">createPipeline</span>, <span className="text-slate-200">AgentCluster</span> &#125; <span className="text-steel font-medium">from</span> <span className="text-slate-300">"@krait/core-engine"</span>;
                  </p>
                  <p>
                    <span className="text-steel font-medium">export const</span> <span className="text-slate-100 font-semibold">pipeline</span> = <span className="text-slate-200">createPipeline</span>(&#123; <span className="text-slate-400">id</span>: <span className="text-slate-300">"krait-abyss-v4"</span>, <span className="text-slate-400">concurrency</span>: <span className="text-steel">128</span> &#125;);
                  </p>
                  <p>
                    <span className="text-steel font-medium">await</span> <span className="text-slate-100 font-semibold">pipeline</span>.<span className="text-slate-200">initializeStream</span>(&#123; <span className="text-slate-400">mode</span>: <span className="text-slate-300">"realtime"</span>, <span className="text-slate-400">vectors</span>: <span className="text-steel">1536</span> &#125;);
                  </p>
                  <p className="text-steel font-medium">// ✓ Live Neural Execution Engine Active</p>
                </div>
              </div>
            )}

            {activeTab === "agent" && (
              <div className="grid grid-cols-[24px_1fr] gap-2.5">
                <div className="text-slate-600 select-none text-right font-mono text-[11px] space-y-0.5">
                  <div>01</div>
                  <div>02</div>
                  <div>03</div>
                  <div>04</div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-slate-500">// Krait Autonomous Agent Cluster Configuration</p>
                  <p>
                    <span className="text-steel font-medium">export interface</span> <span className="text-slate-200 font-semibold">AgentConfig</span> &#123; <span className="text-slate-400">maxTokens</span>: <span className="text-steel">number</span>; <span className="text-slate-400">temperature</span>: <span className="text-steel">number</span>; &#125;
                  </p>
                  <p>
                    <span className="text-steel font-medium">export const</span> <span className="text-slate-100 font-semibold">agentConfig</span>: <span className="text-slate-200">AgentConfig</span> = &#123; <span className="text-slate-400">maxTokens</span>: <span className="text-steel">4096</span>, <span className="text-slate-400">temperature</span>: <span className="text-steel">0.2</span> &#125;;
                  </p>
                  <p className="text-slate-500">// Multi-agent swarm ready for dispatch</p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="grid grid-cols-[24px_1fr] gap-2.5">
                <div className="text-slate-600 select-none text-right font-mono text-[11px] space-y-0.5">
                  <div>01</div>
                  <div>02</div>
                  <div>03</div>
                  <div>04</div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-slate-500">// Zero-Trust Security Gate & Turnstile Verification</p>
                  <p>
                    <span className="text-steel font-medium">import</span> &#123; <span className="text-slate-200">verifyTurnstile</span> &#125; <span className="text-steel font-medium">from</span> <span className="text-slate-300">"@krait/security"</span>;
                  </p>
                  <p>
                    <span className="text-steel font-medium">export async function</span> <span className="text-slate-100 font-semibold">authGate</span>(<span className="text-slate-300">token</span>: <span className="text-steel">string</span>) &#123; <span className="text-steel font-medium">return await</span> <span className="text-slate-200">verifyTurnstile</span>(<span className="text-slate-300">token</span>); &#125;
                  </p>
                  <p className="text-steel font-medium">// Gate status: PASS (0ms overhead)</p>
                </div>
              </div>
            )}

            {activeTab === "terminal" && (
              <div className="space-y-1 font-mono text-xs">
                {terminalLogs.map((log, idx) => (
                  <p key={idx} className={log.startsWith("✓") ? "text-steel font-semibold" : log.startsWith("krait-core") ? "text-steel font-bold" : "text-slate-400"}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* ── INTEGRATED VS CODE BOTTOM TERMINAL PANEL ───────────────────── */}
          <div className="border-t border-border/50 bg-[#07090e] p-2.5 font-mono text-[11px] text-muted-foreground select-none">
            <div className="flex items-center justify-between border-b border-border/40 pb-1 mb-1.5">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-semibold">
                <span className="text-steel flex items-center gap-1 border-b border-steel pb-0.5">
                  <Terminal className="h-3 w-3 text-steel" /> TERMINAL
                </span>
                <span className="hover:text-foreground transition-colors cursor-pointer">OUTPUT</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">DEBUG CONSOLE</span>
              </div>
              <span className="text-[10px] text-steel font-bold">bash - 120x18</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="text-steel font-bold">krait-abyss@prod:~$</span>
              <span className="text-steel font-mono">npm run telemetry --live</span>
              <span className="h-3 w-1.5 bg-steel animate-pulse inline-block" />
            </div>
          </div>
        </div>
      </div>

      {/* ── VS CODE STATUS FOOTER BAR ────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-border/60 bg-[#0b0e14] px-3 py-1 font-mono text-[10px] text-muted-foreground select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-steel font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-steel animate-pulse" />
            <span>TYPESCRIPT OK</span>
          </span>
          <span>UTF-8</span>
          <span>LN 5, COL 32</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-steel">LATENCY: 12ms</span>
          <span className="text-amber-400 font-semibold">PROD READY</span>
        </div>
      </div>
    </div>
  );
}
