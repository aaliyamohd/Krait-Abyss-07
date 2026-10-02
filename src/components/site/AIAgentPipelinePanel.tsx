export function AIAgentPipelinePanel({ className = "" }: { className?: string }) {
  const paths = [
    // 1. Trigger -> Left Merge
    "M 185 95 C 245 95, 265 185, 295 185",
    // 2. Data -> Left Merge
    "M 185 275 C 245 275, 265 185, 295 185",
    // 3. Left Merge -> AI Agent
    "M 295 185 L 340 185",
    // 4. AI Agent -> Branch Split
    "M 570 185 L 610 185",
    // 5. Branch -> Tools
    "M 610 185 C 665 185, 685 58, 725 58",
    // 6. Branch -> Logic
    "M 610 185 L 725 185",
    // 7. Branch -> Memory
    "M 610 185 C 665 185, 685 312, 725 312",
    // 8. Tools -> Right Merge
    "M 900 58 C 955 58, 975 185, 1010 185",
    // 9. Logic -> Right Merge
    "M 900 185 L 1010 185",
    // 10. Memory -> Right Merge
    "M 900 312 C 955 312, 975 185, 1010 185",
    // 11. Right Merge -> Output
    "M 1010 185 L 1055 185",
  ];

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      {/* ── MONOCHROME HIGH-PRECISION WORKFLOW DIAGRAM ── */}
      <svg viewBox="0 0 1240 360" className="w-full h-auto overflow-visible">
        {/* ── CRISP SLATE CONNECTOR PATHS (1.5px STATIC SLATE LINES) ── */}
        {paths.map((d, i) => (
          <path key={`base-${i}`} d={d} stroke="#475569" strokeWidth="1.5" fill="none" />
        ))}

        {/* Arrowheads */}
        <polygon points="330,181 340,185 330,189" fill="#94a3b8" />
        <polygon points="1045,181 1055,185 1045,189" fill="#94a3b8" />

        {/* ── SILVER-WHITE DATA PARTICLES ALONG CONNECTOR PATHS ── */}
        {/* 1. Trigger -> Left Merge */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 185 95 C 245 95, 265 185, 295 185"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 185 95 C 245 95, 265 185, 295 185"
            dur="2.6s"
            repeatCount="indefinite"
            begin="1.3s"
          />
        </circle>

        {/* 2. Data -> Left Merge */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 185 275 C 245 275, 265 185, 295 185"
            dur="2.6s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 185 275 C 245 275, 265 185, 295 185"
            dur="2.6s"
            repeatCount="indefinite"
            begin="1.9s"
          />
        </circle>

        {/* 3. Merge -> Agent */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion path="M 295 185 L 340 185" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* 4. Agent -> Split */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion path="M 570 185 L 610 185" dur="0.9s" repeatCount="indefinite" />
        </circle>

        {/* 5. Branch -> Tools */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 610 185 C 665 185, 685 58, 725 58"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 610 185 C 665 185, 685 58, 725 58"
            dur="2.6s"
            repeatCount="indefinite"
            begin="1.3s"
          />
        </circle>

        {/* 6. Branch -> Logic */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 610 185 L 725 185"
            dur="1.8s"
            repeatCount="indefinite"
            begin="0.4s"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 610 185 L 725 185"
            dur="1.8s"
            repeatCount="indefinite"
            begin="1.3s"
          />
        </circle>

        {/* 7. Branch -> Memory */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 610 185 C 665 185, 685 312, 725 312"
            dur="2.6s"
            repeatCount="indefinite"
            begin="0.8s"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 610 185 C 665 185, 685 312, 725 312"
            dur="2.6s"
            repeatCount="indefinite"
            begin="2.1s"
          />
        </circle>

        {/* 8. Tools -> Right Merge */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 900 58 C 955 58, 975 185, 1010 185"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 900 58 C 955 58, 975 185, 1010 185"
            dur="2.2s"
            repeatCount="indefinite"
            begin="1.1s"
          />
        </circle>

        {/* 9. Logic -> Right Merge */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 900 185 L 1010 185"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 900 185 L 1010 185"
            dur="1.5s"
            repeatCount="indefinite"
            begin="1.0s"
          />
        </circle>

        {/* 10. Memory -> Right Merge */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion
            path="M 900 312 C 955 312, 975 185, 1010 185"
            dur="2.2s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </circle>
        <circle r="2.0" fill="#94a3b8">
          <animateMotion
            path="M 900 312 C 955 312, 975 185, 1010 185"
            dur="2.2s"
            repeatCount="indefinite"
            begin="1.7s"
          />
        </circle>

        {/* 11. Right Merge -> Output */}
        <circle r="2.2" fill="#cbd5e1">
          <animateMotion path="M 1010 185 L 1055 185" dur="1.1s" repeatCount="indefinite" />
        </circle>

        {/* Connection Port Dots */}
        {[
          { x: 185, y: 95 },
          { x: 185, y: 275 },
          { x: 295, y: 185 },
          { x: 340, y: 185 },
          { x: 570, y: 185 },
          { x: 610, y: 185 },
          { x: 725, y: 58 },
          { x: 725, y: 185 },
          { x: 725, y: 312 },
          { x: 900, y: 58 },
          { x: 900, y: 185 },
          { x: 900, y: 312 },
          { x: 1010, y: 185 },
          { x: 1055, y: 185 },
        ].map((pt, i) => (
          <circle
            key={`port-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="3.2"
            fill="#cbd5e1"
            stroke="#334155"
            strokeWidth="1"
          />
        ))}

        {/* ── MONOCHROME ENLARGED NODE CARDS ─── */}

        {/* 1. Trigger Node (175 x 80) */}
        <g>
          <rect
            x="10"
            y="55"
            width="175"
            height="80"
            rx="12"
            fill="#0d0f17"
            stroke="#1e2436"
            strokeWidth="1.6"
          />
          <g transform="translate(30, 83)">
            <path d="M 10 2 L 2 14 H 10 L 8 24 L 18 10 H 10 Z" fill="#f8fafc" />
          </g>
          <text
            x="60"
            y="101"
            fill="#f8fafc"
            fontSize="18"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Trigger
          </text>
          <circle cx="170" cy="69" r="4.5" fill="#22c55e" />
        </g>

        {/* 2. Data Node (175 x 80) */}
        <g>
          <rect
            x="10"
            y="235"
            width="175"
            height="80"
            rx="12"
            fill="#0d0f17"
            stroke="#1e2436"
            strokeWidth="1.6"
          />
          <g
            transform="translate(30, 263)"
            stroke="#f8fafc"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          >
            <ellipse cx="9" cy="4" rx="7" ry="3" />
            <path d="M 2 4 v 5 c 0 1.6 3.1 3 7 3 s 7 -1.4 7 -3 v -5" />
            <path d="M 2 9 v 5 c 0 1.6 3.1 3 7 3 s 7 -1.4 7 -3 v -5" />
          </g>
          <text
            x="60"
            y="281"
            fill="#f8fafc"
            fontSize="18"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Data
          </text>
          <circle cx="170" cy="249" r="4.5" fill="#22c55e" />
        </g>

        {/* 3. AI Agent Node (Hero Central Node - 230 x 104) */}
        <g>
          <rect
            x="340"
            y="133"
            width="230"
            height="104"
            rx="14"
            fill="#121524"
            stroke="#283046"
            strokeWidth="2.2"
          />
          <g
            transform="translate(441, 150)"
            stroke="#f8fafc"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          >
            <rect x="2" y="6" width="23" height="15" rx="3" />
            <circle cx="8" cy="12" r="1.6" fill="#f8fafc" />
            <circle cx="19" cy="12" r="1.6" fill="#f8fafc" />
            <path d="M 10 17 h 7" />
            <path d="M 13.5 1 v 5" />
          </g>
          <text
            x="455"
            y="211"
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="20"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
          >
            AI Agent
          </text>
          <circle cx="550" cy="148" r="4.5" fill="#22c55e" />
        </g>

        {/* 4. Tools Node (175 x 80) */}
        <g>
          <rect
            x="725"
            y="18"
            width="175"
            height="80"
            rx="12"
            fill="#0d0f17"
            stroke="#1e2436"
            strokeWidth="1.6"
          />
          <g
            transform="translate(745, 46)"
            stroke="#f8fafc"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </g>
          <text
            x="775"
            y="64"
            fill="#f8fafc"
            fontSize="18"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Tools
          </text>
          <circle cx="885" cy="32" r="4.5" fill="#22c55e" />
        </g>

        {/* 5. Logic Node (175 x 80) */}
        <g>
          <rect
            x="725"
            y="145"
            width="175"
            height="80"
            rx="12"
            fill="#0d0f17"
            stroke="#1e2436"
            strokeWidth="1.6"
          />
          <g
            transform="translate(745, 173)"
            stroke="#f8fafc"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          >
            <circle cx="5" cy="4" r="2" />
            <circle cx="15" cy="4" r="2" />
            <circle cx="10" cy="15" r="2" />
            <path d="M 5 6 v 3 a 2.5 2.5 0 0 0 2.5 2.5 h 5 a 2.5 2.5 0 0 0 2.5 -2.5 v -3" />
            <path d="M 10 11.5 v 1.5" />
          </g>
          <text
            x="775"
            y="191"
            fill="#f8fafc"
            fontSize="18"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Logic
          </text>
          <circle cx="885" cy="159" r="4.5" fill="#22c55e" />
        </g>

        {/* 6. Memory Node (175 x 80) */}
        <g>
          <rect
            x="725"
            y="272"
            width="175"
            height="80"
            rx="12"
            fill="#0d0f17"
            stroke="#1e2436"
            strokeWidth="1.6"
          />
          <g
            transform="translate(745, 300)"
            stroke="#f8fafc"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          >
            <ellipse cx="9" cy="4" rx="7" ry="3" />
            <path d="M 2 4 v 5 c 0 1.6 3.1 3 7 3 s 7 -1.4 7 -3 v -5" />
            <path d="M 2 9 v 5 c 0 1.6 3.1 3 7 3 s 7 -1.4 7 -3 v -5" />
          </g>
          <text
            x="775"
            y="318"
            fill="#f8fafc"
            fontSize="18"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Memory
          </text>
          <circle cx="885" cy="286" r="4.5" fill="#22c55e" />
        </g>

        {/* 7. Output Node (175 x 80) */}
        <g>
          <rect
            x="1055"
            y="145"
            width="175"
            height="80"
            rx="12"
            fill="#0d0f17"
            stroke="#1e2436"
            strokeWidth="1.6"
          />
          <g
            transform="translate(1075, 173)"
            stroke="#f8fafc"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 18 2 L 12.5 18 L 9.5 11 L 2 8 Z" />
            <path d="M 18 2 L 9.5 11" />
          </g>
          <text
            x="1105"
            y="191"
            fill="#f8fafc"
            fontSize="18"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Output
          </text>
          <circle cx="1215" cy="159" r="4.5" fill="#22c55e" />
        </g>
      </svg>
    </div>
  );
}
