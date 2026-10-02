export interface WorkProject {
  id: string;
  title: string;
  clientName: string;
  category: string;
  description: string;
  problem?: string;
  whatWasBuilt?: string;
  keyFeatures?: string[];
  techStack: string[];
  frontendTech?: string[];
  backendTech?: string[];
  databaseTech?: string[];
  apiIntegrations?: string[];
  aiAutomation?: string[];
  deploymentPlatform?: string[];
  mainFunctionality?: string;
  fullDetails?: string;
  imageUrl?: string;
  liveUrl?: string;
  completedDate: string;
  createdAt: string;
  isFeatured?: boolean;
  metrics?: Array<{ label: string; val: string }>;
  highlights?: string[];
}

/**
 * INITIAL WORK & CASE STUDIES SHOWCASE
 */
export const INITIAL_WORK_PROJECTS: WorkProject[] = [
  {
    id: "record-writers",
    title: "Record Writers Platform",
    clientName: "Record Writers",
    category: "Order Management & Documentation",
    description:
      "Automated order processing and document fulfillment system for academic and medical records.",
    problem:
      "Manual paperwork processing caused delays (3+ days) for academic transcript verification and medical document fulfillment, leading to backlog and high operational overhead.",
    whatWasBuilt:
      "High-concurrency web platform featuring an automated intake queue, instant SLA dispatching, encrypted document storage, and multi-channel customer notifications.",
    keyFeatures: [
      "Automated Record Intake Queue",
      "Sub-2 Hour SLA Fulfillment Engine",
      "Encrypted Record Storage (AES-256)",
      "Multi-Channel Alerts (Email, WhatsApp, Webhooks)",
      "Real-time Order Telemetry Tracking",
      "Student & Medical Record Verification",
    ],
    techStack: ["React 19", "TypeScript", "Tailwind CSS", "Netlify Edge", "Express Node.js", "Supabase Postgres", "n8n Automation", "REST APIs"],
    frontendTech: ["React 19", "TypeScript", "Tailwind CSS", "Lucide Icons", "TanStack Router"],
    backendTech: ["Express.js Server Engine", "n8n Business Automation Workflows", "Netlify Serverless Functions"],
    databaseTech: ["Supabase PostgreSQL", "Row-Level Security (RLS)", "AES-256 Storage Encryption"],
    apiIntegrations: ["Resend Email API", "WhatsApp / Twilio Webhooks", "Telegram Bot API"],
    aiAutomation: ["n8n Automated Fulfillment Workflows", "Intelligent Order Dispatch & Routing"],
    deploymentPlatform: ["Netlify Edge CDN", "Global SSL & DNS Routing", "Zero-Trust Architecture"],
    mainFunctionality:
      "Enables clients to submit academic and medical record verification requests, tracks fulfillment status step-by-step, and automatically dispatches completed records within 2 hours.",
    fullDetails:
      "Live at recordwriters07.netlify.app — Features automated order dispatch, document tracking, and encrypted intake routing.",
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://recordwriters07.netlify.app/",
    completedDate: "2026-09-20",
    createdAt: "2026-09-20T00:00:00.000Z",
    isFeatured: true,
    metrics: [
      { label: "Delivery SLA", val: "< 2 Hours" },
      { label: "Encryption Standard", val: "AES-256" },
      { label: "Verified Uptime", val: "99.99%" },
      { label: "Order Accuracy", val: "100%" },
    ],
    highlights: [
      "Built production automated intake pipeline for academic and medical verification requests.",
      "Integrated zero-trust document security with AES-256 encryption at rest and in transit.",
      "Engineered real-time order telemetry status tracking dashboard for clients.",
      "Configured multi-channel notification dispatch across Resend Email, WhatsApp, and Telegram.",
    ],
  },
];
