export type Service = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  summary: string;
  items: string[];
  serviceContext: string;
  previewTags: string;
};

export const services: Service[] = [
  {
    slug: "ai-ml-solutions",
    index: "01",
    title: "AI/ML Solutions",
    tagline: "Intelligent models and AI-powered systems built for real-world applications.",
    summary:
      "Machine learning models, computer vision, NLP engines, LLM applications, and retrieval-augmented generation systems engineered for speed, accuracy, and production reliability.",
    items: [
      "Machine Learning",
      "NLP (Natural Language Processing)",
      "Computer Vision",
      "LLM Applications",
      "RAG Systems",
      "AI Chatbots",
      "Predictive Systems",
      "Recommendation Systems",
      "Model & API Integrations",
    ],
    serviceContext: "ai-ml",
    previewTags: "Machine Learning · NLP · Vision · LLMs · RAG",
  },
  {
    slug: "ai-custom-solutions",
    index: "02",
    title: "AI Custom Solutions",
    tagline: "Custom AI agents, cognitive automation pipelines, and multi-agent systems.",
    summary:
      "Autonomous AI agents, n8n workflow pipelines, CRM & communication bots, sales/lead generation agents, and custom AI integrations wired into your existing operations.",
    items: [
      "AI Agents",
      "Agentic AI",
      "Multi-Agent Systems",
      "n8n Automation",
      "Business Workflows",
      "CRM Automation",
      "Email & WhatsApp Automation",
      "Research Agents",
      "Sales & Lead Agents",
      "Custom AI Integrations",
    ],
    serviceContext: "ai-custom",
    previewTags: "Agents · Agentic AI · n8n · Workflows",
  },
  {
    slug: "website-digital",
    index: "03",
    title: "Website & App Development",
    tagline: "Custom mobile app development, iOS/Android platforms, high-performance web apps, and digital experiences.",
    summary:
      "Full-cycle web and mobile application engineering: iOS & Android native apps, React Native cross-platform apps, Progressive Web Apps (PWAs), responsive web applications, App Store & Google Play publishing, push notifications, offline data sync, and modern UI/UX design systems.",
    items: [
      "iOS & Android Mobile Apps",
      "React Native & Cross-Platform Apps",
      "Progressive Web Applications (PWA)",
      "High-Performance Business Websites",
      "SaaS Mobile & Web Frontends",
      "App Store & Google Play Publishing",
      "Mobile UI/UX Design & Prototyping",
      "Push Notifications & Offline Sync",
      "Mobile Backend API & Auth Integration",
      "Responsive Web & Tablet Experiences",
    ],
    serviceContext: "website-digital",
    previewTags: "iOS/Android Apps · React Native · Web Apps · PWAs · UI/UX",
  },
  {
    slug: "software-saas",
    index: "04",
    title: "Software & SaaS",
    tagline: "Scalable SaaS platforms, custom software, databases, and microservices.",
    summary:
      "Full-stack SaaS platforms, admin dashboards, internal business tools, and custom web applications with role-based auth, APIs, and scalable database architecture.",
    items: [
      "SaaS Platforms",
      "Custom Software",
      "Web Applications",
      "Internal Tools",
      "Admin Dashboards",
      "MVP Development",
      "API Development & Integration",
    ],
    serviceContext: "software-saas",
    previewTags: "SaaS · Software · Dashboards · APIs · MVP",
  },
  {
    slug: "design-creative",
    index: "05",
    title: "Design & Creative",
    tagline: "Brand identity, UI/UX systems, digital media, and motion graphics.",
    summary:
      "Research-informed user interfaces, design systems, visual identities, product motion graphics, and marketing assets designed with precision and consistency.",
    items: [
      "UI/UX Design",
      "Graphic Design",
      "Branding & Logo Design",
      "Video & Motion Graphics",
      "Creative Assets",
      "Digital Media & Creatives",
    ],
    serviceContext: "design-creative",
    previewTags: "UI/UX · Branding · Graphic Design · Motion",
  },
  {
    slug: "business-operations",
    index: "06",
    title: "Business & Operations",
    tagline: "Digital transformation, process automation, documentation, and cloud infrastructure.",
    summary:
      "Online presence setup, lead capture pipelines, business digitalization, technical documentation, cloud deployment, and ongoing engineering maintenance & support.",
    items: [
      "Business Digitalization",
      "Process Automation",
      "Workflow Optimization",
      "CRM & Operations",
      "Documentation",
      "Deployment & DevOps",
      "Maintenance & Support",
      "Custom Business Solutions",
    ],
    serviceContext: "business-operations",
    previewTags: "Digitalization · Operations · Docs · Support",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
