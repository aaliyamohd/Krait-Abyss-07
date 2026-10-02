import { team } from "./team";

export type ChatbotFAQCategory =
  | "General"
  | "Services"
  | "Web Development"
  | "Software Development"
  | "AI/ML"
  | "AI Agents"
  | "Automation"
  | "SaaS"
  | "UI/UX"
  | "Backend"
  | "APIs"
  | "AWS/Cloud"
  | "Database"
  | "Digital Marketing"
  | "Social Media"
  | "Research"
  | "Team"
  | "Projects"
  | "Collaboration"
  | "Contact";

export type ChatbotFAQ = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: ChatbotFAQCategory;
  hasContactAction?: boolean;
  relatedSuggestions?: string[];
};

export const chatbotFAQs: ChatbotFAQ[] = [
  // ==========================================
  // 1. GENERAL & OVERVIEW
  // ==========================================
  {
    id: "gen-what-is",
    question: "What is Krait Abyss?",
    answer:
      "Krait Abyss is a technology studio focused on building high-performance web applications, custom software, backend infrastructure, AI solutions, digital marketing campaigns, and technical research.",
    keywords: ["what is krait abyss", "krait abyss", "about krait", "who is krait", "studio"],
    category: "General",
    relatedSuggestions: [
      "What services do you provide?",
      "Do you build websites?",
      "Do you provide AI solutions?",
      "Who is in the team?",
    ],
  },
  {
    id: "gen-what-does",
    question: "What does Krait Abyss do?",
    answer:
      "Krait Abyss delivers end-to-end digital solutions: custom web development, full-stack software engineering, AI/ML integrations, cloud architecture on AWS, digital marketing campaigns, and market research.",
    keywords: ["what does krait abyss do", "what do you do", "company overview", "studio work"],
    category: "General",
    relatedSuggestions: [
      "What services do you provide?",
      "Do you build websites?",
      "Who handles development?",
      "How to work with us?",
    ],
  },
  {
    id: "gen-company-type",
    question: "What kind of company is Krait Abyss?",
    answer:
      "Krait Abyss is an engineering-first technology and digital studio. We build production software, robust web applications, scalable backends, and digital growth engines.",
    keywords: ["kind of company", "type of agency", "studio type", "business model"],
    category: "General",
    relatedSuggestions: [
      "What services do you provide?",
      "What technologies do you use?",
      "Who handles development?",
    ],
  },
  {
    id: "gen-tech-stack",
    question: "What technologies does Krait Abyss work with?",
    answer:
      "We work with React, TypeScript, TanStack Start, Next.js, Tailwind CSS, Python, Node.js, PostgreSQL, Supabase, AWS (EC2, Lambda, S3, RDS), Docker, and OpenAI / Anthropic APIs.",
    keywords: ["technologies", "tech stack", "languages", "frameworks", "tools", "code"],
    category: "General",
    relatedSuggestions: [
      "Do you build websites?",
      "Do you provide backend development?",
      "Do you work with AWS?",
    ],
  },
  {
    id: "gen-different",
    question: "What makes Krait Abyss different?",
    answer:
      "We combine deep technical software engineering with high-end visual aesthetics, disciplined delivery processes, fixed-scope transparency, and direct engineering ownership.",
    keywords: ["different", "why choose", "advantage", "unique", "special"],
    category: "General",
    relatedSuggestions: [
      "What services do you provide?",
      "How can I work with Krait Abyss?",
      "Contact Team",
    ],
  },

  // ==========================================
  // 2. SERVICES OVERVIEW
  // ==========================================
  {
    id: "srv-overview",
    question: "What services does Krait Abyss provide?",
    answer:
      "Krait Abyss works across web development, software development, AI/ML solutions, cloud and backend systems, digital marketing, social media, research, and related technology services.",
    keywords: ["services", "what services", "capabilities", "offerings", "all services"],
    category: "Services",
    relatedSuggestions: [
      "Do you build websites?",
      "Do you provide AI solutions?",
      "Do you build SaaS platforms?",
      "Digital marketing",
    ],
  },

  // ==========================================
  // 3. WEB DEVELOPMENT & UI/UX
  // ==========================================
  {
    id: "web-build-websites",
    question: "Do you build websites?",
    answer:
      "Yes. Krait Abyss provides modern website design and development, including responsive interfaces, interactive experiences, and full-stack web solutions.",
    keywords: [
      "build websites",
      "do you build websites",
      "create website",
      "make website",
      "web dev",
    ],
    category: "Web Development",
    relatedSuggestions: [
      "Do you create UI/UX designs?",
      "Do you build full-stack websites?",
      "Can you build web applications?",
      "Contact Team",
    ],
  },
  {
    id: "web-modern",
    question: "Can you create modern websites?",
    answer:
      "Yes. We build sleek, modern web interfaces with dark technical typography, fast load times, responsive grids, and subtle visual motion.",
    keywords: ["modern websites", "modern UI", "fresh look", "contemporary design"],
    category: "Web Development",
    relatedSuggestions: [
      "Do you create UI/UX designs?",
      "Can you create animated websites?",
      "Do you build websites?",
    ],
  },
  {
    id: "web-responsive",
    question: "Do you build responsive websites?",
    answer:
      "Yes. Every website we engineer is meticulously tested and responsive across all viewports, from mobile smartphones to ultra-wide desktop monitors.",
    keywords: ["responsive", "mobile friendly", "tablet", "all screens", "mobile responsive"],
    category: "Web Development",
    relatedSuggestions: [
      "Do you build websites?",
      "Can you optimize website performance?",
      "UI/UX design",
    ],
  },
  {
    id: "web-ui-ux",
    question: "Do you create UI/UX designs?",
    answer:
      "Yes. We craft tailored UI/UX interfaces, design systems, dark-theme visual graphics, interactive component libraries, and user flows.",
    keywords: ["ui/ux", "ui design", "ux design", "interfaces", "wireframes", "user experience"],
    category: "UI/UX",
    relatedSuggestions: [
      "Do you build websites?",
      "Can you redesign an existing website?",
      "Who handles frontend?",
    ],
  },
  {
    id: "web-redesign",
    question: "Can you redesign an existing website?",
    answer:
      "Yes. We can modernize, re-architect, and redesign existing legacy websites with upgraded visual interfaces, faster frameworks, and modern backends.",
    keywords: ["redesign", "revamp", "modernize website", "rebuild website", "update site"],
    category: "Web Development",
    relatedSuggestions: [
      "Do you build websites?",
      "Can you optimize website performance?",
      "Contact Team",
    ],
  },
  {
    id: "web-fullstack",
    question: "Do you build full-stack websites?",
    answer:
      "Yes. We engineer full-stack web solutions combining React/TypeScript frontends with secure backend APIs, database storage, and authentication.",
    keywords: ["full stack", "fullstack", "frontend and backend", "database connected"],
    category: "Web Development",
    relatedSuggestions: [
      "Do you provide backend development?",
      "Can you build web applications?",
      "SaaS platforms",
    ],
  },
  {
    id: "web-landing-pages",
    question: "Can you build landing pages?",
    answer:
      "Yes. We build high-converting, motion-rich landing pages engineered for product launches, studio campaigns, and lead generation.",
    keywords: ["landing page", "product page", "campaign page", "sales page"],
    category: "Web Development",
    relatedSuggestions: [
      "Do you build websites?",
      "Do you provide digital marketing?",
      "Contact Team",
    ],
  },
  {
    id: "web-business-sites",
    question: "Can you build business websites?",
    answer:
      "Yes. We build custom business websites, corporate portals, enquiry systems, and client dashboards for growing enterprises.",
    keywords: ["business websites", "company site", "corporate website", "agency site"],
    category: "Web Development",
    relatedSuggestions: [
      "Do you build websites?",
      "Do you provide digital marketing?",
      "How to work with us",
    ],
  },
  {
    id: "web-portfolio",
    question: "Can you build portfolio websites?",
    answer:
      "Yes. We design interactive portfolio sites, creative showcases, and studio presentation websites with custom typography and motion.",
    keywords: ["portfolio", "showcase", "personal website", "creator site"],
    category: "Web Development",
    relatedSuggestions: ["Do you build websites?", "Can you create interactive websites?"],
  },
  {
    id: "web-ecommerce",
    question: "Can you build e-commerce websites?",
    answer:
      "Yes. We build e-commerce web applications featuring secure checkout gateways, product catalog management, and payment integrations.",
    keywords: ["ecommerce", "e-commerce", "online store", "shop", "stripe checkout"],
    category: "Web Development",
    relatedSuggestions: ["Do you build SaaS platforms?", "Can you add payment systems?"],
  },
  {
    id: "web-interactive",
    question: "Can you create interactive websites?",
    answer:
      "Yes. We specialize in rich interactive experiences with 3D canvas objects, cursor-tracked parallax, dark cybernetic visual effects, and fluid animation.",
    keywords: ["interactive", "3d website", "canvas", "parallax", "motion", "effects"],
    category: "Web Development",
    relatedSuggestions: ["Can you build 3D websites?", "Can you create animated websites?"],
  },
  {
    id: "web-animated",
    question: "Can you create animated websites?",
    answer:
      "Yes. We use Framer Motion, CSS keyframes, and Three.js canvas animations to add sophisticated, non-distracting motion to web interfaces.",
    keywords: ["animated", "animations", "motion", "framer motion", "transitions"],
    category: "Web Development",
    relatedSuggestions: ["Can you create interactive websites?", "Do you create UI/UX designs?"],
  },
  {
    id: "web-3d",
    question: "Can you build 3D websites?",
    answer:
      "Yes. We build 3D web experiences using WebGL, Three.js, and interactive shaders while maintaining fast performance.",
    keywords: ["3d websites", "threejs", "webgl", "canvas 3d", "3d orb", "cybernetic"],
    category: "Web Development",
    relatedSuggestions: ["Can you create interactive websites?", "What technologies do you use?"],
  },
  {
    id: "web-performance",
    question: "Can you optimize website performance?",
    answer:
      "Yes. We perform speed optimization, bundle reduction, image compression, SSR tuning, and Core Web Vitals improvements.",
    keywords: ["performance", "speed", "optimize", "core web vitals", "fast loading"],
    category: "Web Development",
    relatedSuggestions: ["Do you build websites?", "Redesign website"],
  },

  // ==========================================
  // 4. SOFTWARE DEVELOPMENT
  // ==========================================
  {
    id: "sw-dev-overview",
    question: "Do you develop software?",
    answer:
      "Yes. We design, build, and deploy custom software applications, web tools, admin panels, and full-stack enterprise systems.",
    keywords: ["develop software", "software development", "custom software", "software apps"],
    category: "Software Development",
    relatedSuggestions: [
      "Can you build SaaS platforms?",
      "Can you develop APIs?",
      "Do you provide backend development?",
    ],
  },
  {
    id: "sw-web-apps",
    question: "Can you build web applications?",
    answer:
      "Yes. We construct complex web applications with authenticated client portals, real-time data sync, microservices, and database storage.",
    keywords: ["web applications", "web apps", "web app development", "portal"],
    category: "Software Development",
    relatedSuggestions: ["Do you build SaaS platforms?", "Can you create custom dashboards?"],
  },
  {
    id: "sw-apis",
    question: "Can you develop and integrate APIs?",
    answer:
      "Yes. We design RESTful APIs, GraphQL endpoints, and integrate third-party web services including Stripe, OpenAI, Supabase, and AWS.",
    keywords: ["apis", "develop apis", "api integration", "rest api", "graphql"],
    category: "APIs",
    relatedSuggestions: ["Do you provide backend development?", "Do you work with databases?"],
  },
  {
    id: "sw-dashboards",
    question: "Can you create custom dashboards?",
    answer:
      "Yes. We create real-time admin dashboards, data analytics portals, telemetry panels, and internal control tools.",
    keywords: ["dashboards", "custom dashboard", "admin panel", "analytics portal"],
    category: "Software Development",
    relatedSuggestions: ["Can you build SaaS platforms?", "Do you work with databases?"],
  },
  {
    id: "sw-scalable",
    question: "Can you build scalable applications?",
    answer:
      "Yes. We build scalable software architectures utilizing cloud infrastructure, modular code bases, caching layers, and database optimization.",
    keywords: ["scalable", "scalability", "high traffic", "cloud native", "enterprise"],
    category: "Software Development",
    relatedSuggestions: ["Do you work with AWS?", "Do you provide backend development?"],
  },
  {
    id: "sw-maintain",
    question: "Can you maintain existing software?",
    answer:
      "Yes. We provide software maintenance, code refactoring, bug fixes, dependency updates, and feature enhancements for existing products.",
    keywords: ["maintain software", "maintenance", "refactoring", "bug fixing", "support"],
    category: "Software Development",
    relatedSuggestions: ["Who handles testing?", "Do you provide backend development?"],
  },

  // ==========================================
  // 5. AI / ML & AI AGENTS & AUTOMATION
  // ==========================================
  {
    id: "ai-solutions-gen",
    question: "Do you provide AI solutions?",
    answer:
      "Yes. Krait Abyss can work with AI/ML, generative AI, LLM-based applications, AI agents, automation, and AI integrations depending on the project requirements.",
    keywords: [
      "ai solutions",
      "do you provide ai",
      "ai capabilities",
      "artificial intelligence",
      "ml",
    ],
    category: "AI/ML",
    relatedSuggestions: [
      "Can you build AI agents?",
      "Do you work with LLMs?",
      "Can you integrate AI into websites?",
    ],
  },
  {
    id: "ai-apps",
    question: "Do you build AI applications?",
    answer:
      "Yes. We build AI-assisted software tools, intelligent search engines, automated text/data processing applications, and smart chat portals.",
    keywords: ["ai applications", "ai apps", "ai tools", "smart software"],
    category: "AI/ML",
    relatedSuggestions: ["Do you build AI chatbots?", "Can you build AI agents?"],
  },
  {
    id: "ai-chatbots",
    question: "Do you build AI chatbots?",
    answer:
      "Yes. We build controlled, production-ready website chatbots, knowledge search bots, and customer support assistants integrated into websites.",
    keywords: ["ai chatbots", "chatbots", "website chatbot", "bot development", "support bot"],
    category: "AI/ML",
    relatedSuggestions: ["Do you provide AI solutions?", "Can you integrate AI into websites?"],
  },
  {
    id: "ai-agents-dev",
    question: "Can you build AI agents?",
    answer:
      "Yes. We develop autonomous AI agents, tool-using cognitive bots, RAG pipelines, and multi-agent workflow systems tailored to business processes.",
    keywords: ["ai agents", "build ai agents", "autonomous agents", "agentic", "multi agent"],
    category: "AI Agents",
    relatedSuggestions: ["Can you automate tasks using AI?", "Do you work with LLMs?"],
  },
  {
    id: "ai-llms",
    question: "Do you work with LLMs?",
    answer:
      "Yes. We work with proprietary LLM APIs (OpenAI GPT-4o, Anthropic Claude) as well as open-source model integrations and prompt engineering.",
    keywords: ["llm", "large language models", "gpt", "claude", "openai", "prompt engineering"],
    category: "AI/ML",
    relatedSuggestions: ["Do you provide AI solutions?", "Can you build AI agents?"],
  },
  {
    id: "ai-web-integrate",
    question: "Can you integrate AI into websites?",
    answer:
      "Yes. We embed AI features directly into websites, including natural language search, intelligent content processing, and interactive AI widgets.",
    keywords: ["integrate ai into websites", "ai website", "ai web integration"],
    category: "AI/ML",
    relatedSuggestions: ["Do you build websites?", "Do you build AI chatbots?"],
  },
  {
    id: "ai-automation",
    question: "Can you automate tasks using AI?",
    answer:
      "Yes. We build automated cognitive workflows for document parsing, lead processing, email handling, and repetitive operational data tasks.",
    keywords: [
      "automate tasks",
      "automation",
      "ai automation",
      "workflow automation",
      "process automation",
    ],
    category: "Automation",
    relatedSuggestions: ["Can you build AI agents?", "Do you provide AI solutions?"],
  },

  // ==========================================
  // 6. SAAS PLATFORMS
  // ==========================================
  {
    id: "saas-platforms",
    question: "Do you build SaaS platforms?",
    answer:
      "Yes. We build end-to-end SaaS products complete with user onboarding, subscription billing, multi-tenant security, and admin control panels.",
    keywords: ["saas", "saas platforms", "build saas", "software as a service"],
    category: "SaaS",
    relatedSuggestions: [
      "Can you add authentication?",
      "Can you add payment systems?",
      "Can you build user dashboards?",
    ],
  },
  {
    id: "saas-subscriptions",
    question: "Can you create subscription-based applications?",
    answer:
      "Yes. We integrate recurring subscription models, plan tier management, and automated invoicing using Stripe, PayPal, or Lemon Squeezy.",
    keywords: ["subscription", "recurring billing", "stripe subscription", "billing portal"],
    category: "SaaS",
    relatedSuggestions: ["Can you add payment systems?", "Do you build SaaS platforms?"],
  },
  {
    id: "saas-auth",
    question: "Can you add authentication and security?",
    answer:
      "Yes. We implement secure user authentication including OAuth (Google, GitHub), magic links, multi-factor auth, and role-based permissions.",
    keywords: ["authentication", "auth", "login", "oauth", "security", "permissions"],
    category: "SaaS",
    relatedSuggestions: ["Do you build SaaS platforms?", "Can you create secure APIs?"],
  },
  {
    id: "saas-payments",
    question: "Can you add payment systems?",
    answer:
      "Yes. We integrate payment processors for single purchases, recurring subscriptions, invoice billing, and credit consumption.",
    keywords: ["payment systems", "payments", "stripe", "credit card", "billing"],
    category: "SaaS",
    relatedSuggestions: ["Can you create credit-based systems?", "Do you build SaaS platforms?"],
  },

  // ==========================================
  // 7. BACKEND, CLOUD, AWS & DATABASES
  // ==========================================
  {
    id: "back-dev",
    question: "Do you provide backend development?",
    answer:
      "Yes. We engineer secure backend services, database schemas, microservices, and serverless APIs built for reliability.",
    keywords: ["backend development", "backend", "server side", "backend engineer"],
    category: "Backend",
    relatedSuggestions: [
      "Do you work with AWS?",
      "Do you work with databases?",
      "Who handles backend?",
    ],
  },
  {
    id: "back-db",
    question: "Do you work with databases?",
    answer:
      "Yes. We design and optimize relational and document databases using PostgreSQL, Supabase, MySQL, Redis, and MongoDB.",
    keywords: ["databases", "database", "postgresql", "supabase", "sql", "mongodb"],
    category: "Database",
    relatedSuggestions: ["Do you provide backend development?", "Who handles database?"],
  },
  {
    id: "back-aws",
    question: "Do you work with AWS?",
    answer:
      "Yes. We architect, deploy, and manage cloud infrastructure on Amazon Web Services (AWS) using EC2, Lambda, S3, RDS, and CloudFront.",
    keywords: ["aws", "amazon web services", "cloud", "s3", "lambda", "ec2"],
    category: "AWS/Cloud",
    relatedSuggestions: ["Who handles backend and AWS?", "Can you deploy applications?"],
  },
  {
    id: "back-deploy",
    question: "Can you deploy applications to production?",
    answer:
      "Yes. We handle production deployments, SSL configuration, domain setup, CI/CD automated pipelines, and cloud server provisioning.",
    keywords: ["deploy", "deployment", "production", "hosting", "ci/cd"],
    category: "AWS/Cloud",
    relatedSuggestions: ["Do you work with AWS?", "Do you provide backend development?"],
  },

  // ==========================================
  // 8. DIGITAL MARKETING & SEO
  // ==========================================
  {
    id: "mkt-digital",
    question: "Do you provide digital marketing?",
    answer:
      "Yes. Krait Abyss provides digital marketing strategy, online growth campaigns, lead generation systems, and digital presence execution.",
    keywords: ["digital marketing", "marketing", "growth", "campaigns", "leads"],
    category: "Digital Marketing",
    relatedSuggestions: [
      "Do you provide SEO?",
      "Do you manage social media?",
      "Who handles digital marketing?",
    ],
  },
  {
    id: "mkt-seo",
    question: "Do you provide SEO services?",
    answer:
      "Yes. We perform technical SEO audits, site speed optimization, keyword structuring, meta tag configuration, and search ranking strategies.",
    keywords: ["seo", "search engine optimization", "search rankings", "google search"],
    category: "Digital Marketing",
    relatedSuggestions: [
      "Do you provide digital marketing?",
      "Can you optimize website performance?",
    ],
  },

  // ==========================================
  // 9. SOCIAL MEDIA
  // ==========================================
  {
    id: "soc-media",
    question: "Do you manage social media?",
    answer:
      "Yes. We handle social media channel management, content planning, visual coordination, and audience engagement across digital platforms.",
    keywords: ["social media", "manage social media", "instagram", "linkedin", "social accounts"],
    category: "Social Media",
    relatedSuggestions: ["Who handles social media?", "Do you provide digital marketing?"],
  },

  // ==========================================
  // 10. RESEARCH
  // ==========================================
  {
    id: "res-services",
    question: "Do you provide research services?",
    answer:
      "Yes. We conduct client research, market analysis, technology evaluation, competitive benchmarking, and client pitch preparation.",
    keywords: [
      "research",
      "research services",
      "market analysis",
      "tech research",
      "investigation",
    ],
    category: "Research",
    relatedSuggestions: ["Who handles research?", "What makes Krait Abyss different?"],
  },

  // ==========================================
  // 11. TEAM (Reusing src/data/team.ts)
  // ==========================================
  {
    id: "team-fe",
    question: "Who handles frontend development?",
    answer: `${team[0]?.name || "Mohd Aaliya Jabeen"} (${team[0]?.role}) leads Front-End Design, UI/UX, and Website Building at Krait Abyss.`,
    keywords: [
      "who handles frontend",
      "who does frontend",
      "frontend developer",
      "frontend lead",
      "who works on websites",
      "who builds websites",
      "aaliya",
      "jabeen",
      "ui designer",
    ],
    category: "Team",
    relatedSuggestions: [
      "Who handles backend?",
      "Who handles testing?",
      "What services do you provide?",
    ],
  },
  {
    id: "team-be",
    question: "Who handles backend and AWS?",
    answer: `${team[1]?.name || "Abdullah Mohammed Khan"} (${team[1]?.role}) builds Backend Systems, AWS & Cloud Infrastructure, and Database integrations.`,
    keywords: [
      "who handles backend",
      "who does backend",
      "backend developer",
      "who handles aws",
      "aws engineer",
      "abdullah",
      "khan",
      "cloud engineer",
    ],
    category: "Team",
    relatedSuggestions: ["Who handles frontend?", "Who handles testing?", "Do you work with AWS?"],
  },
  {
    id: "team-qa",
    question: "Who handles software testing and debugging?",
    answer: `${team[2]?.name || "Shahistha Aliya Shaik"} (${team[2]?.role}) owns Software Testing, Debugging, and Quality Assurance across studio releases.`,
    keywords: [
      "who handles testing",
      "who does testing",
      "testing engineer",
      "qa engineer",
      "shahistha",
      "shaik",
      "debugging",
    ],
    category: "Team",
    relatedSuggestions: [
      "Who handles frontend?",
      "Who handles backend?",
      "Do you maintain software?",
    ],
  },
  {
    id: "team-res",
    question: "Who handles research and pitching?",
    answer: `${team[3]?.name || "Mohammed Fardeen"} (${team[3]?.role}) leads Client & Market Research and Pitching, and ${team[4]?.name || "Mohd Saniya Begum"} (${team[4]?.role}) handles Research Data & Database Management.`,
    keywords: [
      "who handles research",
      "who does research",
      "who handles pitching",
      "fardeen",
      "saniya",
      "database handling",
    ],
    category: "Team",
    relatedSuggestions: ["Who handles digital marketing?", "Who is in the team?"],
  },
  {
    id: "team-mkt",
    question: "Who handles digital marketing?",
    answer: `${team[5]?.name || "Keshav Loya"} (${team[5]?.role}) runs Digital Marketing strategies, campaigns, and online growth.`,
    keywords: [
      "who handles digital marketing",
      "who does marketing",
      "marketing lead",
      "keshav",
      "loya",
    ],
    category: "Team",
    relatedSuggestions: ["Who handles social media?", "Do you provide digital marketing?"],
  },
  {
    id: "team-soc",
    question: "Who manages social media?",
    answer: `${team[6]?.name || "Mohammed Imran Khan"} (${team[6]?.role}) manages Social Media channels, content coordination, and audience engagement.`,
    keywords: [
      "who manages social media",
      "who handles social media",
      "social lead",
      "imran",
      "khan",
    ],
    category: "Team",
    relatedSuggestions: ["Who handles digital marketing?", "Do you manage social media?"],
  },

  // ==========================================
  // 12. PROJECTS, COLLABORATION & CONTACT
  // ==========================================
  {
    id: "proj-types",
    question: "What type of projects does Krait Abyss work on?",
    answer:
      "We work on web applications, custom software products, AI agent integrations, cloud backends, digital marketing campaigns, and technical research.",
    keywords: ["type of projects", "projects", "work on", "portfolio projects"],
    category: "Projects",
    relatedSuggestions: ["What services do you provide?", "How to work with us?", "Contact Team"],
  },
  {
    id: "collab-how",
    question: "How can I work with Krait Abyss?",
    answer:
      "You can start a project by reaching out to our help team, scheduling a discovery call, or submitting a project brief.",
    keywords: [
      "how to work with us",
      "work with krait abyss",
      "hire us",
      "start project",
      "engage",
    ],
    category: "Collaboration",
    hasContactAction: true,
    relatedSuggestions: ["How can I contact you?", "What services do you provide?"],
  },
  {
    id: "cnt-how",
    question: "How can I contact you?",
    answer:
      "For detailed information, project discussions, or business enquiries, you can contact the Krait Abyss help team.",
    keywords: ["contact you", "how to contact", "contact team", "email", "reach out"],
    category: "Contact",
    hasContactAction: true,
    relatedSuggestions: ["How can I work with Krait Abyss?", "What services do you provide?"],
  },
];
